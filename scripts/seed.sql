-- Datos de prueba para la base de datos de contratos de alquiler
-- Este script debe ejecutarse después de init.sql

-- Insertar direcciones de propiedades (Madrid, Barcelona, Valencia)
INSERT INTO addresses (id, type, street, number, neighborhood, city, state, zipCode, country) VALUES
-- Propiedades en Madrid
('550e8400-e29b-41d4-a716-446655440001', 'property', 'Calle Gran Vía', '45', 'Centro', 'Madrid', 'Madrid', '28013', 'España'),
('550e8400-e29b-41d4-a716-446655440002', 'property', 'Calle Alcalá', '120', 'Retiro', 'Madrid', 'Madrid', '28009', 'España'),
('550e8400-e29b-41d4-a716-446655440003', 'property', 'Calle Serrano', '80', 'Salamanca', 'Madrid', 'Madrid', '28006', 'España'),
('550e8400-e29b-41d4-a716-446655440004', 'property', 'Calle Fuencarral', '25', 'Malasaña', 'Madrid', 'Madrid', '28004', 'España'),
-- Propiedades en Barcelona
('550e8400-e29b-41d4-a716-446655440005', 'property', 'Passeig de Gràcia', '92', 'Eixample', 'Barcelona', 'Barcelona', '08008', 'España'),
('550e8400-e29b-41d4-a716-446655440006', 'property', 'Carrer de Balmes', '157', 'Gràcia', 'Barcelona', 'Barcelona', '08037', 'España'),
('550e8400-e29b-41d4-a716-446655440007', 'property', 'Rambla de Catalunya', '65', 'Eixample', 'Barcelona', 'Barcelona', '08007', 'España'),
-- Propiedades en Valencia
('550e8400-e29b-41d4-a716-446655440008', 'property', 'Calle Colón', '18', 'Ciutat Vella', 'Valencia', 'Valencia', '46004', 'España'),
('550e8400-e29b-41d4-a716-446655440009', 'property', 'Avenida del Reino de Valencia', '30', 'Camins al Grau', 'Valencia', 'Valencia', '46023', 'España'),
('550e8400-e29b-41d4-a716-446655440010', 'property', 'Calle Xàtiva', '89', 'Extramurs', 'Valencia', 'Valencia', '46007', 'España'),
-- Propiedades adicionales
('550e8400-e29b-41d4-a716-446655440011', 'property', 'Calle Mayor', '12', 'Centro', 'Madrid', 'Madrid', '28012', 'España'),
('550e8400-e29b-41d4-a716-446655440012', 'property', 'Carrer del Consell de Cent', '234', 'Eixample', 'Barcelona', 'Barcelona', '08011', 'España'),
('550e8400-e29b-41d4-a716-446655440013', 'property', 'Plaza de la Virgen', '5', 'Ciutat Vella', 'Valencia', 'Valencia', '46001', 'España');

-- Insertar direcciones de propietarios
INSERT INTO addresses (id, type, street, number, neighborhood, city, state, zipCode, country) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'tenant', 'Calle Velázquez', '143', 'Salamanca', 'Madrid', 'Madrid', '28006', 'España'),
('550e8400-e29b-41d4-a716-446655440102', 'tenant', 'Carrer de Muntaner', '200', 'Eixample', 'Barcelona', 'Barcelona', '08036', 'España'),
('550e8400-e29b-41d4-a716-446655440103', 'tenant', 'Calle Princesa', '55', 'Moncloa', 'Madrid', 'Madrid', '28008', 'España'),
('550e8400-e29b-41d4-a716-446655440104', 'tenant', 'Avenida Diagonal', '420', 'Eixample', 'Barcelona', 'Barcelona', '08037', 'España'),
('550e8400-e29b-41d4-a716-446655440105', 'tenant', 'Calle Blasco Ibáñez', '45', 'Algirós', 'Valencia', 'Valencia', '46021', 'España');

-- Insertar direcciones de inquilinos
INSERT INTO addresses (id, type, street, number, neighborhood, city, state, zipCode, country) VALUES
('550e8400-e29b-41d4-a716-446655440201', 'tenant', 'Calle Bravo Murillo', '78', 'Tetuán', 'Madrid', 'Madrid', '28020', 'España'),
('550e8400-e29b-41d4-a716-446655440202', 'tenant', 'Carrer de Provença', '345', 'Eixample', 'Barcelona', 'Barcelona', '08037', 'España'),
('550e8400-e29b-41d4-a716-446655440203', 'tenant', 'Calle Atocha', '92', 'Centro', 'Madrid', 'Madrid', '28012', 'España'),
('550e8400-e29b-41d4-a716-446655440204', 'tenant', 'Carrer de Valencia', '178', 'Eixample', 'Barcelona', 'Barcelona', '08011', 'España'),
('550e8400-e29b-41d4-a716-446655440205', 'tenant', 'Calle Guillem de Castro', '65', 'Ciutat Vella', 'Valencia', 'Valencia', '46008', 'España'),
('550e8400-e29b-41d4-a716-446655440206', 'tenant', 'Calle Hortaleza', '110', 'Chueca', 'Madrid', 'Madrid', '28004', 'España'),
('550e8400-e29b-41d4-a716-446655440207', 'tenant', 'Carrer de Pau Claris', '88', 'Eixample', 'Barcelona', 'Barcelona', '08010', 'España'),
('550e8400-e29b-41d4-a716-446655440208', 'tenant', 'Avenida de la Constitución', '23', 'Ciutat Vella', 'Valencia', 'Valencia', '46003', 'España'),
('550e8400-e29b-41d4-a716-446655440209', 'tenant', 'Calle Argensola', '34', 'Almagro', 'Madrid', 'Madrid', '28004', 'España'),
('550e8400-e29b-41d4-a716-446655440210', 'tenant', 'Carrer de Rosselló', '256', 'Eixample', 'Barcelona', 'Barcelona', '08008', 'España'),
('550e8400-e29b-41d4-a716-446655440211', 'tenant', 'Calle Poeta Querol', '12', 'Ciutat Vella', 'Valencia', 'Valencia', '46002', 'España'),
('550e8400-e29b-41d4-a716-446655440212', 'tenant', 'Calle Malasaña', '19', 'Malasaña', 'Madrid', 'Madrid', '28004', 'España'),
('550e8400-e29b-41d4-a716-446655440213', 'tenant', 'Carrer de Girona', '143', 'Eixample', 'Barcelona', 'Barcelona', '08037', 'España');

-- Insertar direcciones de referencias
INSERT INTO addresses (id, type, street, number, neighborhood, city, state, zipCode, country) VALUES
('550e8400-e29b-41d4-a716-446655440301', 'reference', 'Calle Alcántara', '89', 'Salamanca', 'Madrid', 'Madrid', '28006', 'España'),
('550e8400-e29b-41d4-a716-446655440302', 'reference', 'Carrer de Còrsega', '234', 'Eixample', 'Barcelona', 'Barcelona', '08036', 'España'),
('550e8400-e29b-41d4-a716-446655440303', 'reference', 'Calle Sagasta', '67', 'Chamberí', 'Madrid', 'Madrid', '28010', 'España'),
('550e8400-e29b-41d4-a716-446655440304', 'reference', 'Carrer de Mallorca', '445', 'Eixample', 'Barcelona', 'Barcelona', '08013', 'España'),
('550e8400-e29b-41d4-a716-446655440305', 'reference', 'Calle Pintor Sorolla', '78', 'Pla del Real', 'Valencia', 'Valencia', '46010', 'España'),
('550e8400-e29b-41d4-a716-446655440306', 'reference', 'Calle Goya', '123', 'Salamanca', 'Madrid', 'Madrid', '28001', 'España'),
('550e8400-e29b-41d4-a716-446655440307', 'reference', 'Carrer de Bailèn', '56', 'Eixample', 'Barcelona', 'Barcelona', '08009', 'España'),
('550e8400-e29b-41d4-a716-446655440308', 'reference', 'Avenida de Aragón', '91', 'Algirós', 'Valencia', 'Valencia', '46021', 'España');

-- Insertar usuarios administradores
INSERT INTO users (id, type, addressId, firstName, middleName, lastName, email, phone) VALUES
('550e8400-e29b-41d4-a716-446655440401', 'admin', '550e8400-e29b-41d4-a716-446655440101', 'Carlos', 'Alberto', 'García López', 'carlos.garcia@inmobiliaria.es', '+34 91 123 45 67'),
('550e8400-e29b-41d4-a716-446655440402', 'admin', '550e8400-e29b-41d4-a716-446655440102', 'María', 'Carmen', 'Martínez Rodríguez', 'maria.martinez@propiedades.es', '+34 93 234 56 78');

-- Insertar propietarios (usando tipo admin para propietarios)
INSERT INTO users (id, type, addressId, firstName, middleName, lastName, email, phone) VALUES
('550e8400-e29b-41d4-a716-446655440403', 'admin', '550e8400-e29b-41d4-a716-446655440103', 'Antonio', 'José', 'Fernández Sánchez', 'antonio.fernandez@gmail.com', '+34 91 345 67 89'),
('550e8400-e29b-41d4-a716-446655440404', 'admin', '550e8400-e29b-41d4-a716-446655440104', 'Isabel', 'María', 'González Pérez', 'isabel.gonzalez@hotmail.com', '+34 93 456 78 90'),
('550e8400-e29b-41d4-a716-446655440405', 'admin', '550e8400-e29b-41d4-a716-446655440105', 'Francisco', 'Javier', 'López Martín', 'francisco.lopez@yahoo.es', '+34 96 567 89 01');

-- Insertar inquilinos
INSERT INTO users (id, type, addressId, firstName, middleName, lastName, email, phone) VALUES
('550e8400-e29b-41d4-a716-446655440501', 'tenant', '550e8400-e29b-41d4-a716-446655440201', 'Ana', 'Belén', 'Ruiz García', 'ana.ruiz@gmail.com', '+34 91 678 90 12'),
('550e8400-e29b-41d4-a716-446655440502', 'tenant', '550e8400-e29b-41d4-a716-446655440202', 'David', 'Miguel', 'Moreno López', 'david.moreno@gmail.com', '+34 93 789 01 23'),
('550e8400-e29b-41d4-a716-446655440503', 'tenant', '550e8400-e29b-41d4-a716-446655440203', 'Laura', 'Patricia', 'Jiménez Martínez', 'laura.jimenez@outlook.com', '+34 91 890 12 34'),
('550e8400-e29b-41d4-a716-446655440504', 'tenant', '550e8400-e29b-41d4-a716-446655440204', 'Sergio', 'Daniel', 'Herrera Rodríguez', 'sergio.herrera@gmail.com', '+34 93 901 23 45'),
('550e8400-e29b-41d4-a716-446655440505', 'tenant', '550e8400-e29b-41d4-a716-446655440205', 'Carmen', 'Rosa', 'Navarro Sánchez', 'carmen.navarro@gmail.com', '+34 96 012 34 56'),
('550e8400-e29b-41d4-a716-446655440506', 'tenant', '550e8400-e29b-41d4-a716-446655440206', 'Javier', 'Luis', 'Romero Fernández', 'javier.romero@gmail.com', '+34 91 123 45 67'),
('550e8400-e29b-41d4-a716-446655440507', 'tenant', '550e8400-e29b-41d4-a716-446655440207', 'Elena', 'Cristina', 'Vázquez González', 'elena.vazquez@gmail.com', '+34 93 234 56 78'),
('550e8400-e29b-41d4-a716-446655440508', 'tenant', '550e8400-e29b-41d4-a716-446655440208', 'Miguel', 'Ángel', 'Castillo Pérez', 'miguel.castillo@gmail.com', '+34 96 345 67 89'),
('550e8400-e29b-41d4-a716-446655440509', 'tenant', '550e8400-e29b-41d4-a716-446655440209', 'Pilar', 'Amparo', 'Ortega Martín', 'pilar.ortega@gmail.com', '+34 91 456 78 90'),
('550e8400-e29b-41d4-a716-446655440510', 'tenant', '550e8400-e29b-41d4-a716-446655440210', 'Roberto', 'Carlos', 'Delgado López', 'roberto.delgado@gmail.com', '+34 93 567 89 01'),
('550e8400-e29b-41d4-a716-446655440511', 'tenant', '550e8400-e29b-41d4-a716-446655440211', 'Mónica', 'Teresa', 'Rubio García', 'monica.rubio@gmail.com', '+34 96 678 90 12'),
('550e8400-e29b-41d4-a716-446655440512', 'tenant', '550e8400-e29b-41d4-a716-446655440212', 'Álvaro', 'José', 'Medina Rodríguez', 'alvaro.medina@gmail.com', '+34 91 789 01 23'),
('550e8400-e29b-41d4-a716-446655440513', 'tenant', '550e8400-e29b-41d4-a716-446655440213', 'Cristina', 'María', 'Iglesias Sánchez', 'cristina.iglesias@gmail.com', '+34 93 890 12 34');

-- Insertar referencias
INSERT INTO users (id, type, addressId, firstName, middleName, lastName, email, phone) VALUES
('550e8400-e29b-41d4-a716-446655440601', 'reference', '550e8400-e29b-41d4-a716-446655440301', 'Pedro', 'Antonio', 'Ramos Fernández', 'pedro.ramos@empresa.com', '+34 91 111 22 33'),
('550e8400-e29b-41d4-a716-446655440602', 'reference', '550e8400-e29b-41d4-a716-446655440302', 'Montserrat', 'Pilar', 'Soler Martínez', 'montserrat.soler@consultoría.es', '+34 93 222 33 44'),
('550e8400-e29b-41d4-a716-446655440603', 'reference', '550e8400-e29b-41d4-a716-446655440303', 'José', 'Manuel', 'Prieto González', 'jose.prieto@bufete.com', '+34 91 333 44 55'),
('550e8400-e29b-41d4-a716-446655440604', 'reference', '550e8400-e29b-41d4-a716-446655440304', 'Rosa', 'María', 'Aguilar López', 'rosa.aguilar@medicos.es', '+34 93 444 55 66'),
('550e8400-e29b-41d4-a716-446655440605', 'reference', '550e8400-e29b-41d4-a716-446655440305', 'Fernando', 'Jesús', 'Molina Pérez', 'fernando.molina@arquitectos.com', '+34 96 555 66 77'),
('550e8400-e29b-41d4-a716-446655440606', 'reference', '550e8400-e29b-41d4-a716-446655440306', 'Amparo', 'Dolores', 'Campos Martín', 'amparo.campos@educacion.es', '+34 91 666 77 88'),
('550e8400-e29b-41d4-a716-446655440607', 'reference', '550e8400-e29b-41d4-a716-446655440307', 'Ramón', 'Francisco', 'Blanco Rodríguez', 'ramon.blanco@ingeniería.com', '+34 93 777 88 99'),
('550e8400-e29b-41d4-a716-446655440608', 'reference', '550e8400-e29b-41d4-a716-446655440308', 'Consuelo', 'Esperanza', 'Serrano Sánchez', 'consuelo.serrano@notarios.es', '+34 96 888 99 00');

-- Insertar contratos (13 contratos con diferentes números de versiones)
INSERT INTO contracts (id, landlordId, tenantId, addressId, deposit, createdAt) VALUES
-- Contrato 1: 1 versión (contrato simple)
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440001', 2400.00, '2023-01-15 10:00:00'),
-- Contrato 2: 2 versiones (renovación simple)
('550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440002', 1800.00, '2023-02-01 09:30:00'),
-- Contrato 3: 3 versiones (dos renovaciones)
('550e8400-e29b-41d4-a716-446655440703', '550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440503', '550e8400-e29b-41d4-a716-446655440003', 3000.00, '2022-03-15 11:00:00'),
-- Contrato 4: 4 versiones (múltiples renovaciones)
('550e8400-e29b-41d4-a716-446655440704', '550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440504', '550e8400-e29b-41d4-a716-446655440004', 2200.00, '2022-01-01 08:00:00'),
-- Contrato 5: 2 versiones
('550e8400-e29b-41d4-a716-446655440705', '550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440505', '550e8400-e29b-41d4-a716-446655440005', 2800.00, '2023-06-01 10:30:00'),
-- Contrato 6: 3 versiones
('550e8400-e29b-41d4-a716-446655440706', '550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440506', '550e8400-e29b-41d4-a716-446655440006', 2500.00, '2022-09-01 09:00:00'),
-- Contrato 7: 5 versiones (contrato con muchas renovaciones)
('550e8400-e29b-41d4-a716-446655440707', '550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440507', '550e8400-e29b-41d4-a716-446655440007', 3200.00, '2021-01-01 08:30:00'),
-- Contrato 8: 1 versión
('550e8400-e29b-41d4-a716-446655440708', '550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440508', '550e8400-e29b-41d4-a716-446655440008', 1600.00, '2024-01-15 11:30:00'),
-- Contrato 9: 2 versiones
('550e8400-e29b-41d4-a716-446655440709', '550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440509', '550e8400-e29b-41d4-a716-446655440009', 1700.00, '2023-08-01 10:00:00'),
-- Contrato 10: 3 versiones
('550e8400-e29b-41d4-a716-446655440710', '550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440510', '550e8400-e29b-41d4-a716-446655440010', 1900.00, '2022-12-01 09:15:00'),
-- Contrato 11: 4 versiones
('550e8400-e29b-41d4-a716-446655440711', '550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440511', '550e8400-e29b-41d4-a716-446655440011', 2100.00, '2022-05-01 14:00:00'),
-- Contrato 12: 6 versiones (contrato con más renovaciones)
('550e8400-e29b-41d4-a716-446655440712', '550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440512', '550e8400-e29b-41d4-a716-446655440012', 2600.00, '2020-01-01 08:00:00'),
-- Contrato 13: 1 versión (contrato reciente)
('550e8400-e29b-41d4-a716-446655440713', '550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440513', '550e8400-e29b-41d4-a716-446655440013', 1800.00, '2024-05-01 12:00:00');

-- Insertar versiones de contratos
-- Contrato 1: 1 versión (activo)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440801', '550e8400-e29b-41d4-a716-446655440701', 1, 1200.00, 0.00, 'Vivienda habitual', 'active', 'yearly', '2023-02-01', '2024-01-31', '2024-02-01', 'Prohibido fumar en el interior. Mascotas permitidas con depósito adicional.');

-- Contrato 2: 2 versiones (activo en la segunda)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440802', '550e8400-e29b-41d4-a716-446655440702', 1, 900.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2023-02-15', '2024-02-14', '2024-02-15', 'Gastos de comunidad incluidos.'),
('550e8400-e29b-41d4-a716-446655440803', '550e8400-e29b-41d4-a716-446655440702', 2, 950.00, 5.56, 'Vivienda habitual', 'active', 'yearly', '2024-02-15', '2025-02-14', '2025-02-15', 'Gastos de comunidad incluidos. Incremento por inflación.');

-- Contrato 3: 3 versiones (activo en la tercera)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440804', '550e8400-e29b-41d4-a716-446655440703', 1, 1500.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2022-04-01', '2023-03-31', '2023-04-01', 'Calefacción central incluida.'),
('550e8400-e29b-41d4-a716-446655440805', '550e8400-e29b-41d4-a716-446655440703', 2, 1575.00, 5.00, 'Vivienda habitual', 'expired', 'yearly', '2023-04-01', '2024-03-31', '2024-04-01', 'Calefacción central incluida. Subida del 5%.'),
('550e8400-e29b-41d4-a716-446655440806', '550e8400-e29b-41d4-a716-446655440703', 3, 1650.00, 4.76, 'Vivienda habitual', 'active', 'yearly', '2024-04-01', '2025-03-31', '2025-04-01', 'Calefacción central incluida. Ajuste según IPC.');

-- Contrato 4: 4 versiones (activo en la cuarta)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440807', '550e8400-e29b-41d4-a716-446655440704', 1, 1100.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2022-01-15', '2023-01-14', '2023-01-15', 'Parking incluido en el precio.'),
('550e8400-e29b-41d4-a716-446655440808', '550e8400-e29b-41d4-a716-446655440704', 2, 1155.00, 5.00, 'Vivienda habitual', 'expired', 'yearly', '2023-01-15', '2024-01-14', '2024-01-15', 'Parking incluido. Incremento del 5%.'),
('550e8400-e29b-41d4-a716-446655440809', '550e8400-e29b-41d4-a716-446655440704', 3, 1200.00, 3.90, 'Vivienda habitual', 'expired', 'yearly', '2024-01-15', '2025-01-14', '2025-01-15', 'Parking incluido. Ajuste según mercado.'),
('550e8400-e29b-41d4-a716-446655440810', '550e8400-e29b-41d4-a716-446655440704', 4, 1250.00, 4.17, 'Vivienda habitual', 'active', 'yearly', '2025-01-15', '2026-01-14', '2026-01-15', 'Parking incluido. Mejoras en la propiedad realizadas.');

-- Contrato 5: 2 versiones (activo en la segunda)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440811', '550e8400-e29b-41d4-a716-446655440705', 1, 1400.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2023-06-15', '2024-06-14', '2024-06-15', 'Aire acondicionado incluido.'),
('550e8400-e29b-41d4-a716-446655440812', '550e8400-e29b-41d4-a716-446655440705', 2, 1470.00, 5.00, 'Vivienda habitual', 'active', 'yearly', '2024-06-15', '2025-06-14', '2025-06-15', 'Aire acondicionado incluido. Incremento por inflación.');

-- Contrato 6: 3 versiones (activo en la tercera)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440813', '550e8400-e29b-41d4-a716-446655440706', 1, 1250.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2022-09-15', '2023-09-14', '2023-09-15', 'Terraza privada incluida.'),
('550e8400-e29b-41d4-a716-446655440814', '550e8400-e29b-41d4-a716-446655440706', 2, 1312.50, 5.00, 'Vivienda habitual', 'expired', 'yearly', '2023-09-15', '2024-09-14', '2024-09-15', 'Terraza privada incluida. Subida del 5%.'),
('550e8400-e29b-41d4-a716-446655440815', '550e8400-e29b-41d4-a716-446655440706', 3, 1375.00, 4.76, 'Vivienda habitual', 'active', 'yearly', '2024-09-15', '2025-09-14', '2025-09-15', 'Terraza privada incluida. Ajuste según IPC.');

-- Contrato 7: 5 versiones (activo en la quinta)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440816', '550e8400-e29b-41d4-a716-446655440707', 1, 1600.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2021-01-15', '2022-01-14', '2022-01-15', 'Piscina comunitaria y gimnasio.'),
('550e8400-e29b-41d4-a716-446655440817', '550e8400-e29b-41d4-a716-446655440707', 2, 1680.00, 5.00, 'Vivienda habitual', 'expired', 'yearly', '2022-01-15', '2023-01-14', '2023-01-15', 'Piscina comunitaria y gimnasio. Incremento del 5%.'),
('550e8400-e29b-41d4-a716-446655440818', '550e8400-e29b-41d4-a716-446655440707', 3, 1750.00, 4.17, 'Vivienda habitual', 'expired', 'yearly', '2023-01-15', '2024-01-14', '2024-01-15', 'Piscina comunitaria y gimnasio renovado.'),
('550e8400-e29b-41d4-a716-446655440819', '550e8400-e29b-41d4-a716-446655440707', 4, 1820.00, 4.00, 'Vivienda habitual', 'expired', 'yearly', '2024-01-15', '2025-01-14', '2025-01-15', 'Nuevas instalaciones deportivas añadidas.'),
('550e8400-e29b-41d4-a716-446655440820', '550e8400-e29b-41d4-a716-446655440707', 5, 1900.00, 4.40, 'Vivienda habitual', 'active', 'yearly', '2025-01-15', '2026-01-14', '2026-01-15', 'Todas las instalaciones renovadas. Seguridad 24h.');

-- Contrato 8: 1 versión (activo)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440821', '550e8400-e29b-41d4-a716-446655440708', 1, 800.00, 0.00, 'Vivienda habitual', 'active', 'yearly', '2024-02-01', '2025-01-31', '2025-02-01', 'Cerca del mar. Vistas panorámicas.');

-- Contrato 9: 2 versiones (activo en la segunda)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440822', '550e8400-e29b-41d4-a716-446655440709', 1, 850.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2023-08-15', '2024-08-14', '2024-08-15', 'Balcón con vistas al centro histórico.'),
('550e8400-e29b-41d4-a716-446655440823', '550e8400-e29b-41d4-a716-446655440709', 2, 890.00, 4.71, 'Vivienda habitual', 'active', 'yearly', '2024-08-15', '2025-08-14', '2025-08-15', 'Balcón con vistas al centro histórico. Incremento moderado.');

-- Contrato 10: 3 versiones (activo en la tercera)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440824', '550e8400-e29b-41d4-a716-446655440710', 1, 950.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2022-12-15', '2023-12-14', '2023-12-15', 'Recién reformado completamente.'),
('550e8400-e29b-41d4-a716-446655440825', '550e8400-e29b-41d4-a716-446655440710', 2, 1000.00, 5.26, 'Vivienda habitual', 'expired', 'yearly', '2023-12-15', '2024-12-14', '2024-12-15', 'Electrodomésticos nuevos incluidos.'),
('550e8400-e29b-41d4-a716-446655440826', '550e8400-e29b-41d4-a716-446655440710', 3, 1050.00, 5.00, 'Vivienda habitual', 'active', 'yearly', '2024-12-15', '2025-12-14', '2025-12-15', 'Mobiliario completamente renovado.');

-- Contrato 11: 4 versiones (activo en la cuarta)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440827', '550e8400-e29b-41d4-a716-446655440711', 1, 1050.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2022-05-15', '2023-05-14', '2023-05-15', 'Céntrico con buenas comunicaciones.'),
('550e8400-e29b-41d4-a716-446655440828', '550e8400-e29b-41d4-a716-446655440711', 2, 1100.00, 4.76, 'Vivienda habitual', 'expired', 'yearly', '2023-05-15', '2024-05-14', '2024-05-15', 'Mejoras en la climatización.'),
('550e8400-e29b-41d4-a716-446655440829', '550e8400-e29b-41d4-a716-446655440711', 3, 1150.00, 4.55, 'Vivienda habitual', 'expired', 'yearly', '2024-05-15', '2025-05-14', '2025-05-15', 'Instalación de fibra óptica incluida.'),
('550e8400-e29b-41d4-a716-446655440830', '550e8400-e29b-41d4-a716-446655440711', 4, 1200.00, 4.35, 'Vivienda habitual', 'active', 'yearly', '2025-05-15', '2026-05-14', '2026-05-15', 'Sistemas de seguridad mejorados.');

-- Contrato 12: 6 versiones (activo en la sexta)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440831', '550e8400-e29b-41d4-a716-446655440712', 1, 1300.00, 0.00, 'Vivienda habitual', 'expired', 'yearly', '2020-01-15', '2021-01-14', '2021-01-15', 'Ático con terraza privada de 50m².'),
('550e8400-e29b-41d4-a716-446655440832', '550e8400-e29b-41d4-a716-446655440712', 2, 1365.00, 5.00, 'Vivienda habitual', 'expired', 'yearly', '2021-01-15', '2022-01-14', '2022-01-15', 'Terraza acondicionada con mobiliario.'),
('550e8400-e29b-41d4-a716-446655440833', '550e8400-e29b-41d4-a716-446655440712', 3, 1430.00, 4.76, 'Vivienda habitual', 'expired', 'yearly', '2022-01-15', '2023-01-14', '2023-01-15', 'Instalación de jacuzzi en terraza.'),
('550e8400-e29b-41d4-a716-446655440834', '550e8400-e29b-41d4-a716-446655440712', 4, 1500.00, 4.90, 'Vivienda habitual', 'expired', 'yearly', '2023-01-15', '2024-01-14', '2024-01-15', 'Sistema de riego automático instalado.'),
('550e8400-e29b-41d4-a716-446655440835', '550e8400-e29b-41d4-a716-446655440712', 5, 1575.00, 5.00, 'Vivienda habitual', 'expired', 'yearly', '2024-01-15', '2025-01-14', '2025-01-15', 'Pérgola bioclimática y zona chill-out.'),
('550e8400-e29b-41d4-a716-446655440836', '550e8400-e29b-41d4-a716-446655440712', 6, 1650.00, 4.76, 'Vivienda habitual', 'active', 'yearly', '2025-01-15', '2026-01-14', '2026-01-15', 'Cocina exterior completamente equipada.');

-- Contrato 13: 1 versión (activo)
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440837', '550e8400-e29b-41d4-a716-446655440713', 1, 900.00, 0.00, 'Vivienda habitual', 'active', 'yearly', '2024-05-15', '2025-05-14', '2025-05-15', 'Patrimonio histórico. Casco antiguo de Valencia.');

-- Actualizar contratos con sus versiones actuales
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440801' WHERE id = '550e8400-e29b-41d4-a716-446655440701';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440803' WHERE id = '550e8400-e29b-41d4-a716-446655440702';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440806' WHERE id = '550e8400-e29b-41d4-a716-446655440703';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440810' WHERE id = '550e8400-e29b-41d4-a716-446655440704';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440812' WHERE id = '550e8400-e29b-41d4-a716-446655440705';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440815' WHERE id = '550e8400-e29b-41d4-a716-446655440706';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440820' WHERE id = '550e8400-e29b-41d4-a716-446655440707';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440821' WHERE id = '550e8400-e29b-41d4-a716-446655440708';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440823' WHERE id = '550e8400-e29b-41d4-a716-446655440709';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440826' WHERE id = '550e8400-e29b-41d4-a716-446655440710';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440830' WHERE id = '550e8400-e29b-41d4-a716-446655440711';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440836' WHERE id = '550e8400-e29b-41d4-a716-446655440712';
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440837' WHERE id = '550e8400-e29b-41d4-a716-446655440713';

-- Insertar referencias de contratos (relaciones entre contratos y personas de referencia)
INSERT INTO contractReferences (contractId, referenceId) VALUES
-- Contrato 1
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440601'),
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440602'),
-- Contrato 2
('550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440603'),
-- Contrato 3
('550e8400-e29b-41d4-a716-446655440703', '550e8400-e29b-41d4-a716-446655440604'),
('550e8400-e29b-41d4-a716-446655440703', '550e8400-e29b-41d4-a716-446655440605'),
-- Contrato 4
('550e8400-e29b-41d4-a716-446655440704', '550e8400-e29b-41d4-a716-446655440606'),
-- Contrato 5
('550e8400-e29b-41d4-a716-446655440705', '550e8400-e29b-41d4-a716-446655440607'),
('550e8400-e29b-41d4-a716-446655440705', '550e8400-e29b-41d4-a716-446655440608'),
-- Contrato 6
('550e8400-e29b-41d4-a716-446655440706', '550e8400-e29b-41d4-a716-446655440601'),
-- Contrato 7
('550e8400-e29b-41d4-a716-446655440707', '550e8400-e29b-41d4-a716-446655440602'),
('550e8400-e29b-41d4-a716-446655440707', '550e8400-e29b-41d4-a716-446655440603'),
-- Contrato 8
('550e8400-e29b-41d4-a716-446655440708', '550e8400-e29b-41d4-a716-446655440604'),
-- Contrato 9
('550e8400-e29b-41d4-a716-446655440709', '550e8400-e29b-41d4-a716-446655440605'),
-- Contrato 10
('550e8400-e29b-41d4-a716-446655440710', '550e8400-e29b-41d4-a716-446655440606'),
('550e8400-e29b-41d4-a716-446655440710', '550e8400-e29b-41d4-a716-446655440607'),
-- Contrato 11
('550e8400-e29b-41d4-a716-446655440711', '550e8400-e29b-41d4-a716-446655440608'),
-- Contrato 12
('550e8400-e29b-41d4-a716-446655440712', '550e8400-e29b-41d4-a716-446655440601'),
('550e8400-e29b-41d4-a716-446655440712', '550e8400-e29b-41d4-a716-446655440602'),
-- Contrato 13
('550e8400-e29b-41d4-a716-446655440713', '550e8400-e29b-41d4-a716-446655440603');

-- Insertar algunos contratos terminados para variedad de datos
INSERT INTO contracts (id, landlordId, tenantId, addressId, deposit, createdAt) VALUES
('550e8400-e29b-41d4-a716-446655440714', '550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440005', 2000.00, '2021-06-01 10:00:00');

-- Versión de contrato terminado
INSERT INTO contractVersions (id, contractId, versionNumber, rent, rentIncreasePercentage, business, status, type, startDate, endDate, renewalDate, specialTerms) VALUES
('550e8400-e29b-41d4-a716-446655440838', '550e8400-e29b-41d4-a716-446655440714', 1, 1000.00, 0.00, 'Vivienda habitual', 'terminated', 'yearly', '2021-06-15', '2022-06-14', NULL, 'Contrato terminado anticipadamente por mudanza del inquilino.');

-- Actualizar contrato terminado con su versión actual
UPDATE contracts SET currentVersionId = '550e8400-e29b-41d4-a716-446655440838' WHERE id = '550e8400-e29b-41d4-a716-446655440714';

-- Insertar referencia para contrato terminado
INSERT INTO contractReferences (contractId, referenceId) VALUES
('550e8400-e29b-41d4-a716-446655440714', '550e8400-e29b-41d4-a716-446655440604');

-- Comentarios sobre los datos generados:
-- - Se han creado 14 contratos en total (13 solicitados + 1 terminado para variedad)
-- - Las versiones por contrato varían: 1, 2, 3, 4, 5, y 6 versiones
-- - Se incluyen direcciones reales de Madrid, Barcelona y Valencia
-- - Los nombres y apellidos son típicamente españoles
-- - Los precios de alquiler son realistas para las ciudades mencionadas
-- - Se incluyen términos especiales variados y realistas
-- - Los incrementos de alquiler siguen patrones típicos del mercado español
-- - Se mantiene la integridad referencial de la base de datos
-- - Algunos contratos están activos, otros expirados y uno terminado
