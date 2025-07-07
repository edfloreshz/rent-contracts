package services

import (
	"errors"
	"fmt"

	"github.com/edfloreshz/rent-contracts/src/dto"
	"github.com/edfloreshz/rent-contracts/src/models"
	"github.com/google/uuid"
	"github.com/johnfercher/maroto/v2"
	"github.com/johnfercher/maroto/v2/pkg/components/row"
	"github.com/johnfercher/maroto/v2/pkg/components/text"
	"github.com/johnfercher/maroto/v2/pkg/config"
	"github.com/johnfercher/maroto/v2/pkg/consts/align"
	"github.com/johnfercher/maroto/v2/pkg/consts/fontstyle"
	"github.com/johnfercher/maroto/v2/pkg/consts/pagesize"
	"github.com/johnfercher/maroto/v2/pkg/core"
	"github.com/johnfercher/maroto/v2/pkg/props"
	"gorm.io/gorm"
)

type ContractService struct {
	db *gorm.DB
}

func NewContractService(db *gorm.DB) *ContractService {
	return &ContractService{
		db,
	}
}

func (s *ContractService) CreateContract(req *dto.CreateContractRequest) (*models.Contract, error) {
	contract := &models.Contract{
		LandlordID: req.LandlordID,
		TenantID:   req.TenantID,
		AddressID:  req.AddressID,
	}

	// Start transaction
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Create(contract).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Add references if provided
	if len(req.ReferenceIDs) > 0 {
		for _, refID := range req.ReferenceIDs {
			contractRef := &models.ContractReference{
				ContractID:  contract.ID,
				ReferenceID: refID,
			}
			if err := tx.Create(contractRef).Error; err != nil {
				tx.Rollback()
				return nil, err
			}
		}
	}

	tx.Commit()
	return contract, nil
}

func (s *ContractService) GetContractByID(id uuid.UUID) (*models.Contract, error) {
	var contract models.Contract
	if err := s.db.
		Preload("CurrentVersion").
		Preload("Landlord").
		Preload("Tenant").
		Preload("Tenant.Address").
		Preload("Address").
		Preload("Versions").
		Preload("References").
		Preload("References.Address").
		First(&contract, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("contract not found")
		}
		return nil, err
	}
	return &contract, nil
}

func (s *ContractService) GetAllContracts() ([]models.Contract, error) {
	var contracts []models.Contract
	if err := s.db.
		Preload("CurrentVersion").
		Preload("Landlord").
		Preload("Tenant").
		Preload("Tenant.Address").
		Preload("Address").
		Preload("Versions").
		Find(&contracts).Error; err != nil {
		return nil, err
	}
	return contracts, nil
}

func (s *ContractService) GetContractsByTenant(tenantID uuid.UUID) ([]models.Contract, error) {
	var contracts []models.Contract
	if err := s.db.
		Preload("CurrentVersion").
		Preload("Landlord").
		Preload("Tenant").
		Preload("Tenant.Address").
		Preload("Address").
		Preload("Versions").
		Where("tenantid = ?", tenantID).
		Find(&contracts).Error; err != nil {
		return nil, err
	}
	return contracts, nil
}

func (s *ContractService) UpdateContract(id uuid.UUID, req *dto.UpdateContractRequest) (*models.Contract, error) {
	var contract models.Contract
	if err := s.db.First(&contract, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("contract not found")
		}
		return nil, err
	}

	// Update only provided fields
	if req.LandlordID != nil {
		contract.LandlordID = *req.LandlordID
	}
	if req.TenantID != nil {
		contract.TenantID = *req.TenantID
	}
	if req.AddressID != nil {
		contract.AddressID = *req.AddressID
	}

	if err := s.db.Save(&contract).Error; err != nil {
		return nil, err
	}

	// Handle references update
	if req.ReferenceIDs != nil {
		// Remove existing references
		if err := s.db.Where("contractid = ?", contract.ID).Delete(&models.ContractReference{}).Error; err != nil {
			return nil, err
		}

		// Add new references
		for _, refID := range req.ReferenceIDs {
			contractRef := &models.ContractReference{
				ContractID:  contract.ID,
				ReferenceID: refID,
			}
			if err := s.db.Create(contractRef).Error; err != nil {
				return nil, err
			}
		}
	}

	return &contract, nil
}

func (s *ContractService) DeleteContract(id uuid.UUID) error {
	if err := s.db.Delete(&models.Contract{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (s *ContractService) CreateContractVersion(req *dto.CreateContractVersionRequest) (*models.ContractVersion, error) {
	var maxVersion int
	s.db.Model(&models.ContractVersion{}).
		Where("contractid = ?", req.ContractID).
		Select("COALESCE(MAX(versionnumber), 0)").
		Scan(&maxVersion)

	version := &models.ContractVersion{
		ContractID:             req.ContractID,
		VersionNumber:          maxVersion + 1,
		Rent:                   req.Rent,
		RentIncreasePercentage: req.RentIncreasePercentage,
		Business:               req.Business,
		Status:                 models.ContractStatus(req.Status),
		Type:                   models.ContractType(req.Type),
		StartDate:              req.StartDate,
		EndDate:                req.EndDate,
		RenewalDate:            req.RenewalDate,
		SpecialTerms:           req.SpecialTerms,
	}

	if err := s.db.Create(version).Error; err != nil {
		return nil, err
	}

	return version, nil
}

func (s *ContractService) GetContractVersionByID(id uuid.UUID) (*models.ContractVersion, error) {
	var version models.ContractVersion
	if err := s.db.First(&version, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("contract version not found")
		}
		return nil, err
	}
	return &version, nil
}

func (s *ContractService) GetContractVersionsByContractID(contractID uuid.UUID) ([]models.ContractVersion, error) {
	var versions []models.ContractVersion
	if err := s.db.Where("contractid = ?", contractID).Order("versionnumber DESC").Find(&versions).Error; err != nil {
		return nil, err
	}
	return versions, nil
}

func (s *ContractService) GetContractDocument(id uuid.UUID, versionID *uuid.UUID) ([]byte, error) {
	contract, err := s.GetContractByID(id)
	if err != nil {
		return nil, err
	}

	// If a specific version is requested, find and use that version
	var targetVersion *models.ContractVersion
	if versionID != nil {
		for _, version := range contract.Versions {
			if version.ID == *versionID {
				targetVersion = &version
				break
			}
		}
		if targetVersion == nil {
			return nil, fmt.Errorf("version with ID %s not found", versionID.String())
		}
	} else {
		// Use current version if no specific version requested
		targetVersion = contract.CurrentVersion
	}

	if targetVersion == nil {
		return nil, fmt.Errorf("no version found for contract")
	}

	cfg := config.NewBuilder().
		WithPageSize(pagesize.Legal).
		WithLeftMargin(12).
		WithTopMargin(12).
		WithRightMargin(12).
		WithBottomMargin(12).
		Build()

	m := maroto.New(cfg)

	m.AddRows(
		text.NewRow(10, "CONTRATO DE ARRENDAMIENTO", props.Text{
			Style: fontstyle.Bold,
			Size:  14,
			Align: align.Center,
		}),

		text.NewRow(14, fmt.Sprintf(
			"CONTRATO DE ARRENDAMIENTO QUE CELEBRAN POR UNA PARTE: %s, (PROPIETARIO) QUE EN LO SUCESIVO SERÁ DENOMINADO \"EL ARRENDADOR\" Y POR LA OTRA PARTE: %s QUE EN LO SUCESIVO SERÁ DENOMINADO \"EL ARRENDATARIO\", AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLÁUSULAS:",
			contract.Landlord.FullName(), contract.Tenant.FullName()),
			props.Text{
				VerticalPadding: 1,
				Size:            7,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(6, "DECLARACIONES", props.Text{
			Style: fontstyle.Bold,
			Size:  8,
			Align: align.Center,
		}),

		// Declaration 1
		text.NewRow(13, fmt.Sprintf(
			"1.- Declara \"EL ARRENDADOR\" que es el legítimo propietario y se encuentra en posesión del Inmueble ubicado en: %s, que en adelante será llamado \"EL INMUEBLE\", que es su deseo dar en Arrendamiento \"EL INMUEBLE\" bajo los términos y condiciones que se mencionan en el presente contrato.",
			contract.Address.FullAddress()),
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(16, fmt.Sprintf(
			"2.- \"EL ARRENDATARIO: %s declara que es una persona con capacidad suficiente para obligarse en los términos del presente contrato, y que tiene su domicilio particular en: %s, que es su deseo Arrendar \"EL INMUEBLE\" en los términos y condiciones que se mencionan en este contrato y que recibe de Conformidad \"EL INMUEBLE\" con todas sus instalaciones completas y en servicio a plena satisfacción.",
			contract.Tenant.FullName(), contract.Tenant.Address.FullAddress()),
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(6, "REFERENCIAS", props.Text{
			Style: fontstyle.Bold,
			Size:  8,
			Align: align.Center,
		}),
	)

	rows := []core.Row{
		row.New(4).Add(
			text.NewCol(4, "Nombre", props.Text{Size: 9, Align: align.Center, Style: fontstyle.Bold, Color: &props.WhiteColor}),
			text.NewCol(2, "Telefono", props.Text{Size: 9, Align: align.Center, Style: fontstyle.Bold, Color: &props.WhiteColor}),
			text.NewCol(6, "Dirección", props.Text{Size: 9, Align: align.Center, Style: fontstyle.Bold, Color: &props.WhiteColor}),
		).WithStyle(&props.Cell{BackgroundColor: darkGrayColor()}),
	}

	var contentsRow []core.Row

	for i, reference := range contract.References {
		size := 6.
		if i == len(contract.References)-1 {
			size = 8.
		}
		r := row.New(size).Add(
			text.NewCol(4, reference.FullName(), props.Text{Size: 8, Top: 1, Align: align.Center}),
			text.NewCol(2, reference.Phone, props.Text{Size: 8, Top: 1, Align: align.Center}),
			text.NewCol(6, reference.Address.FullAddress(), props.Text{Size: 8, Top: 1, Align: align.Center}),
		)
		if i%2 == 0 {
			gray := grayColor()
			r.WithStyle(&props.Cell{BackgroundColor: gray})
		}

		contentsRow = append(contentsRow, r)
	}

	rows = append(rows, contentsRow...)

	m.AddRows(rows...)

	m.AddRows(
		text.NewRow(6, "CON VIRTUD DE LO MANIFESTADO EN LAS ANTERIORES DECLARACIONES, CONVIENEN SUJETARSE A LAS SIGUIENTES:",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Bold,
				Align:           align.Center,
			}),

		text.NewRow(6, "CLÁUSULAS", props.Text{
			Style: fontstyle.Bold,
			Size:  8,
			Align: align.Center,
		}),

		text.NewRow(4, "PRIMERA:", props.Text{
			Size:            8,
			VerticalPadding: 1,
			Style:           fontstyle.Bold,
			Align:           align.Left,
			Color:           &props.RedColor,
		}),

		text.NewRow(10, fmt.Sprintf(
			"\"EL ARRENDADOR\" otorga en arrendamiento el EL INMUEBLE a EL ARRENDATARIO, y éste lo recibe a su entera satisfacción, para local de: %s, en buen estado con todas sus instalaciones funcionando y en servicio.",
			targetVersion.Business),
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "SEGUNDA:", props.Text{
			Size:            8,
			VerticalPadding: 1,
			Style:           fontstyle.Bold,
			Align:           align.Left,
			Color:           &props.RedColor,
		}),

		text.NewRow(14, fmt.Sprintf(
			"La renta mensual que el ARRENDATARIO deberá pagar a partir del día: %s fecha desde la cual estará vigente este contrato, es la Cantidad de: $%.2f más un mes de Depósito. Quedando en el entendido de que la renta se pagará cada mes, íntegra y puntualmente el día señalado aún cuando el ARRENDATARIO lo ocupe una parte del mes (o incluso si no lo ocupa).",
			targetVersion.StartDate.Format("02 de enero de 2006"), targetVersion.Rent),
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "TERCERA:", props.Text{
			Size:            8,
			VerticalPadding: 1,
			Style:           fontstyle.Bold,
			Align:           align.Left,
			Color:           &props.RedColor,
		}),

		text.NewRow(18, fmt.Sprintf(
			"Queda expresamente pactado que las rentas se incrementarán automáticamente de forma acumulativa en forma anual, ajustándose las mismas a la variación que haya sufrido el Índice Nacional de precios al consumidor que publica el Banco Nacional de México a través del diario oficial de la federación o en el salario mínimo respecto a los últimos doce meses inmediatos anteriores al mes en que deba realizarse el ajuste al precio de la renta, el que sea mayor. El incremento será del %.2f%%.",
			targetVersion.RentIncreasePercentage),
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "CUARTA:", props.Text{
			Size:            8,
			VerticalPadding: 1,
			Style:           fontstyle.Bold,
			Align:           align.Left,
			Color:           &props.RedColor,
		}),

		text.NewRow(28, fmt.Sprintf(
			"La vigencia del presente contrato será de: %s plazo convenido por ambas partes, a partir del día %s al %s. Al término de dicho plazo de vigencia, EL ARRENDATARIO se obliga a hacer entrega a EL ARRENDADOR el INMUEBLE arrendado, en las condiciones en las cuales lo recibió, todo en buen estado (pisos, paredes, pintura, muebles de baño, cristales, cortinas metálicas etc.) y estando al corriente en todos los pagos de Servicios, tales como Luz (electricidad) y Agua, de los cuales deberá entregar AL ARRENDADOR, los recibos correspondientes totalmente pagados. En caso de que EL ARRENDATARIO no entregará el INMUEBLE a EL ARRENDADOR, al término del presente contrato, EL ARRENDATARIO pagará a EL ARRENDADOR, a partir del siguiente mes por concepto de renta mensual, la cantidad pactada, más un incremento del 6%% mensual por el número de meses que transcurran hasta la firma de renovación del contrato.",
			targetVersion.Type, targetVersion.StartDate.Format("02 de enero de 2006"), targetVersion.EndDate.Format("02 de enero de 2006")),
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "QUINTA:", props.Text{
			Size:            8,
			VerticalPadding: 1,
			Style:           fontstyle.Bold,
			Align:           align.Left,
			Color:           &props.RedColor,
		}),

		text.NewRow(26, fmt.Sprintf(
			"A efecto de garantizar todas y cada una de las obligaciones que se derivan del presente contrato, EL ARRENDATARIO hace entrega al momento de la firma del mismo, La Cantidad de $%.2f por concepto de Depósito en garantía. Suma que se obliga EL ARRENDADOR a devolver a EL ARRENDATARIO a más tardar en 7 (siete) días después de la desocupación del INMUEBLE, siempre y cuando EL ARRENDATARIO lo entregue en el mismo estado en que lo recibió, y previa comprobación (con recibos pagados) de que no existe ningún adeudo derivado de los servicios de Luz y Agua potable, quedando aclarado que el mes de depósito, no se utilizará como pago de renta, es única y exclusivamente para garantizar reparaciones o adeudos pendientes del ARRENDATARIO y se regresará después de verificar que no exista ningún pendiente por liquidar.",
			contract.Deposit),
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "RESCISION DE CONTRATO:", props.Text{
			Size:            8,
			VerticalPadding: 1,
			Style:           fontstyle.Bold,
			Align:           align.Left,
			Color:           &props.RedColor,
		}),

		text.NewRow(10, "EL ARRENDADOR podrá rescindir el presente Contrato, SIN NECESIDAD DE DECLARACION JUDICIAL, por simple Notificación por escrito, por una o más de las siguientes causas:",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "1.- Si EL ARRENDATARIO se RETRASA en el pago de 1 a 2 meses consecutivos de renta.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "2.- Por causar daños al INMUEBLE.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "3.- Si le son suspendidos al INMUEBLE los servicios de Luz o Agua por falta de pago de parte del ARRENDATARIO.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "4.- Por Subarrendar el INMUEBLE.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "5.- Si el ARRENDATARIO deja de ser solvente.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(6, "6.- Por incumplimiento de cualquiera de las cláusulas del presente contrato.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "SEXTA:", props.Text{
			Size:            8,
			VerticalPadding: 1,
			Style:           fontstyle.Bold,
			Align:           align.Left,
			Color:           &props.RedColor,
		}),

		text.NewRow(10, "EL ARRENDADOR NO SE HACE responsable por deterioro o pérdida de los bienes muebles que el ARRENDATARIO tenga en el INMUEBLE en cualquiera de los siguientes casos: robo, incendio, terremoto, inundación, etc. ni por lesiones físicas ocasionadas a personas dentro del inmueble.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "SEPTIMA:", props.Text{
			Size:            8,
			VerticalPadding: 1,
			Style:           fontstyle.Bold,
			Align:           align.Left,
			Color:           &props.RedColor,
		}),

		text.NewRow(18, "A la fecha del vencimiento del presente contrato, previa a la desocupación del INMUEBLE, EL ARRENDADOR hará una inspección del mismo, para verificar el estado en el que se encuentre, de existir desperfectos causados por EL ARRENDATARIO, éste se obliga a efectuar las reparaciones pertinentes de forma inmediata, de lo contrario EL ARRENDADOR podrá hacerlos con el Depósito en garantía, siempre y cuando cubra el importe total de dichas reparaciones.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
			}),

		text.NewRow(4, "IMPORTANTE:", props.Text{
			Size:            8,
			VerticalPadding: 1,
			Style:           fontstyle.Bold,
			Align:           align.Left,
			Color:           &props.RedColor,
		}),

		text.NewRow(14, "En caso de entregar el local antes de la fecha de vencimiento de su contrato, SE PIERDE EL MES DE DEPOSITO y se tiene que entregar el local en las condiciones en que lo recibió, PINTADO Y RESANADO por FUERA Y POR DENTRO en color claro (blanco o beige). Entregar RECIBO DE LUZ dado de BAJA y SIN ADEUDO a la fecha de entrega, y estar al corriente en pago de agua.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Normal,
				Align:           align.Left,
				Color:           &props.BlueColor,
			}),

		// Payment warning
		text.NewRow(8, "LA RENTA SE PAGA EL DIA PRIMERO DE CADA MES, A PARTIR DEL DIA 3 SE COBRARAN $150.00 DE RECARGOS POR PAGO TARDIO.",
			props.Text{
				Size:            8,
				VerticalPadding: 1,
				Style:           fontstyle.Bold,
				Align:           align.Left,
				Color:           &props.RedColor,
			}),
	)

	document, err := m.Generate()
	if err != nil {
		return nil, err
	}

	return document.GetBytes(), nil
}

func darkGrayColor() *props.Color {
	return &props.Color{
		Red:   55,
		Green: 55,
		Blue:  55,
	}
}

func grayColor() *props.Color {
	return &props.Color{
		Red:   200,
		Green: 200,
		Blue:  200,
	}
}
