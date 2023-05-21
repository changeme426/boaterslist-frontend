-- populates the subCategories column with all related subCategory IDs AND categories with category IDs
DELIMITER //
CREATE OR REPLACE PROCEDURE InitLocationCategories()
BEGIN
  ADD_COL_BLK: BEGIN
    DECLARE _count INT;
    SET _count = (  SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE   TABLE_NAME = 'Locations' AND
                            COLUMN_NAME = 'subCategories');
    IF _count = 0 THEN
        ALTER TABLE Locations ADD COLUMN categories JSON NULL;
        ALTER TABLE Locations ADD COLUMN subCategories JSON NULL;
        ALTER TABLE Locations ADD COLUMN country VARCHAR(2) NULL;
        ALTER TABLE Locations ADD COLUMN parentLocationId INT NULL;
        ALTER TABLE Locations ADD COLUMN createdByEmail VARCHAR(254) NULL;
        ALTER TABLE Locations ADD COLUMN verifiedByEmail VARCHAR(254) NULL;
        ALTER TABLE Locations ADD COLUMN ownerAuthEmail VARCHAR(254) NULL;
        ALTER TABLE Locations ADD COLUMN active BOOL NULL;
        ALTER TABLE Locations ADD COLUMN promotedSubCategories JSON NULL;
        ALTER TABLE Categories ADD COLUMN active BOOL NULL;
        ALTER TABLE SubCategories ADD COLUMN active BOOL NULL;
        ALTER TABLE LocationsSubCategories DROP FOREIGN KEY fk_locationsCategories_locationId;
        ALTER TABLE LocationsAreas DROP FOREIGN KEY fk_locationsAreas_locationId;
    END IF;
    UPDATE Categories SET active = 1;
    UPDATE SubCategories SET active = 1;
  END ADD_COL_BLK;

  POPULATE_CATS_BLK: BEGIN
    DECLARE locId, scId INT;
    DECLARE lastLocId INT DEFAULT -1;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cats VARCHAR(1000) DEFAULT '';
    DECLARE cur CURSOR FOR SELECT DISTINCT LSC.locationId, SC.categoryId
      FROM LocationsSubCategories LSC, SubCategories SC
      WHERE SC.subCategoryId = LSC.subCategoryId
      ORDER BY LSC.locationId, SC.categoryId;
    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;

    OPEN cur;
    read_loop: LOOP
      FETCH cur INTO locId, scId;
      IF done THEN
        LEAVE read_loop;
      END IF;
      IF locId <> lastLocId THEN
        IF lastLocId <> -1 THEN
          SET cats = (SELECT CONCAT(cats, ']'));
          UPDATE Locations SET categories=cats WHERE locationId = lastLocId;
        END IF;
        SET lastLocId = locId;
        SET cats = (SELECT CONCAT('[', scId));
      ELSE
        SET cats = (SELECT CONCAT(cats, ',', scId));
      END IF;
    END LOOP;
    CLOSE cur;
    SET cats = (SELECT CONCAT(cats, ']'));
    UPDATE Locations SET categories=cats WHERE locationId = lastLocId;
  END POPULATE_CATS_BLK;

  POPULATE_SUBCATS_BLK: BEGIN
    DECLARE locId, scId INT;
    DECLARE lastLocId INT DEFAULT -1;
    DECLARE done INT DEFAULT FALSE;
    DECLARE subcats VARCHAR(1000) DEFAULT '';
    DECLARE cur CURSOR FOR SELECT DISTINCT locationId, subCategoryId FROM LocationsSubCategories ORDER BY locationId, subCategoryId;
    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;

    OPEN cur;
    read_loop: LOOP
      FETCH cur INTO locId, scId;
      IF done THEN
        LEAVE read_loop;
      END IF;
      IF locId <> lastLocId THEN
        IF lastLocId <> -1 THEN
          SET subcats = (SELECT CONCAT(subcats, ']'));
          UPDATE Locations SET subCategories=subcats, promotedSubCategories=subcats WHERE locationId = lastLocId;
        END IF;
        SET lastLocId = locId;
        SET subcats = (SELECT CONCAT('[', scId));
      ELSE
        SET subcats = (SELECT CONCAT(subcats, ',', scId));
      END IF;
    END LOOP;
    CLOSE cur;
    SET subcats = (SELECT CONCAT(subcats, ']'));
    UPDATE Locations SET subCategories=subcats, promotedSubCategories=subcats WHERE locationId = lastLocId;
    UPDATE Locations SET promotedSubCategories=NULL WHERE premiere <> 1;
  END POPULATE_SUBCATS_BLK;

  POPULATE_USERS_BLK: BEGIN
    UPDATE Locations SET active = 1;
    UPDATE Locations SET createdByEmail = (SELECT userEmail from Users WHERE Users.userId = Locations.createdByUserId);
    UPDATE Locations SET verifiedByEmail = (SELECT userEmail from Users WHERE Users.userId = Locations.verifiedByUserId);
    UPDATE Locations SET ctaJSON=null;
  END POPULATE_USERS_BLK;

  POPULATE_PARENT_LOCATION_BLK: BEGIN
    UPDATE Locations L SET L.parentLocationId = (SELECT MIN(locationId) FROM Locations L2 WHERE L2.companyId = L.companyId);
  END POPULATE_PARENT_LOCATION_BLK;

  DATA_CLEANUP_BLK: BEGIN
    DELETE FROM Locations where locationName is null or locationName IN ('') OR coordinate is null;
    DELETE FROM Locations where locationName like '%nylo%' or locationName like '%Nylo' or locationName like '%test%' or
     locationName like '%Test';
    UPDATE Locations SET address1 = TRIM(address1);
    UPDATE Locations SET address1 = CONCAT(LEFT(address1, CHAR_LENGTH(address1) - 1), '') WHERE address1 LIKE '%,';
    UPDATE Locations SET address2 = TRIM(address2);
    UPDATE Locations SET address2 = CONCAT(LEFT(address2, CHAR_LENGTH(address2) - 1), '') WHERE address2 LIKE '%,';
    UPDATE Locations SET bestFormOfCommunication = TRIM(LOWER(bestFormOfCommunication));
    UPDATE Locations set bestFormOfCommunication = null where bestFormOfCommunication = "" OR bestFormOfCommunication NOT IN
      ('phone', 'email', 'text');
    UPDATE Locations SET boatSize = TRIM(boatSize);
    UPDATE Locations SET city = TRIM(city);
    UPDATE Locations SET city = CONCAT(LEFT(city, CHAR_LENGTH(city) - 1), '') WHERE city LIKE '%,';
    UPDATE Locations SET contactEmail = TRIM(contactEmail);
    UPDATE Locations SET contactPerson = TRIM(contactPerson);
    UPDATE Locations SET contactPhone = TRIM(contactPhone);
    UPDATE Locations SET description = TRIM(description);
    UPDATE Locations SET electricShorePower = TRIM(electricShorePower);
    UPDATE Locations SET fuel = TRIM(fuel);
    UPDATE Locations SET locationName = TRIM(locationName);
    UPDATE Locations SET phoneNumber = TRIM(phoneNumber);
    UPDATE Locations SET priceRangeString = TRIM(priceRangeString);
    UPDATE Locations SET privacyMembershipString = TRIM(privacyMembershipString);
    UPDATE Locations SET slips = TRIM(slips);
    UPDATE Locations SET sponsoredBy = TRIM(sponsoredBy);
    UPDATE Locations SET state = TRIM(state);
    UPDATE Locations SET website = TRIM(website);
    UPDATE Locations SET zipCode = TRIM(zipCode);
    UPDATE Locations SET priceRangeString = TRIM(priceRangeString);

    UPDATE Locations SET webSite = NULL WHERE webSite = '';
    UPDATE Locations SET webSite = CONCAT('https://', webSite) WHERE webSite NOT LIKE 'https%' AND webSite NOT LIKE 'http%';

    UPDATE Locations SET state = 'ON' WHERE state = 'Elk Lake';
    UPDATE Locations SET country = 'BM', state = NULL WHERE state IN ('Bermuda', 'Dockyard', 'HM');
    UPDATE Locations SET country = 'CA' WHERE state IN ('BC', 'ON');
    UPDATE Locations SET country = 'DO' WHERE state = 'Dominican Republic';
    UPDATE Locations SET state = 'Baja California' WHERE state LIKE 'Baja%' OR state LIKE 'Bajo%';
    UPDATE Locations SET state = 'Cabo San Lucas' WHERE state = 'BCS';
    UPDATE Locations SET state = 'Chiapas' WHERE state = 'CHIS';
    UPDATE Locations SET state = 'Guerrero' WHERE state IN ('Gro', 'Guerrerro');
    UPDATE Locations SET state = 'Quintana Roo' WHERE state LIKE 'Quin%';
    UPDATE Locations SET state = 'Oaxaca' WHERE state = 'Oaxaca.';
    UPDATE Locations SET state = 'San Luis Potosí' WHERE state = 'San Luis Posotí';
    UPDATE Locations SET state = 'Sinaloa' WHERE state IN ('Sin', 'Sinalo', 'Sinaola');
    UPDATE Locations SET state = 'Veracruz' WHERE state LIKE 'VER';
    UPDATE Locations SET state = 'Yucatán' WHERE state LIKE 'Yuatan';
    UPDATE Locations SET country = 'MX' WHERE state IN ('Alvarado', 'Aguascalientes', 'Baja California',
      'Cabo San Lucas', 'Campeche', 'Cancún', 'Chiapas', 'Chihuahua', 'Coahuila','Colima', 'Durango','Guanajuato','Guerrero',
      'Hidalgo', 'Huatulco', 'Jalisco', 'Los Cabos', 'Manzanillo', 'Merida', 'Michoacán', 'Morelia', 'Morelos',
      'Moreos', 'Nayarit', 'Neuquén', 'Nuevo Leon', 'Oaxaca', 'Oaxaca juarez', 'Pachuca de Soto', 'Peñasco',
      'Playa del Carmen', 'Puebla', 'Querétaro', 'Quintana Roo', 'Rosales', 'San Luis', 'Sinaloa', 'Sonora',
      'Tabasco', 'Tlaxcala', 'Zacatecas', 'San Luis Potosí', 'Tamaulipas', 'Veracruz', 'Yucatán');
    UPDATE Locations SET country = 'MX' WHERE city IN ('Cabo San Lucas', 'Chihuahua', 'Jalcomulco', 'Playa del Carmen',
    'Ixtapa Zihuatanejo', 'Valle de Bravo', 'Isla Mujeres') OR city LIKE 'Punta%';
    UPDATE Locations SET country = 'BM' WHERE city IN ('Bermuda', 'Hamilton', 'Pembroke');
    UPDATE Locations SET state = 'TX' WHERE city IN ('South Padre');
    UPDATE Locations SET state = 'Mexico', country = 'MX' WHERE state like '%Mexico%' OR state like '%MX%'
      OR state like '%Tours-los-Rauls%';
    UPDATE Locations SET country = 'TC', state = NULL WHERE state = 'Turks And Caicos';
    UPDATE Locations SET country = 'US' WHERE country IS NULL;
    UPDATE Locations SET state = NULL WHERE state IN ('Ave', 'City', 'Island', 'TXT', '');
    UPDATE Locations SET state = 'AK' WHERE state IN ('Alaska', 'AH');
    UPDATE Locations SET state = 'AL' WHERE state = 'Alabama';
    UPDATE Locations SET state = 'AR' WHERE state = 'Arkansas';
    UPDATE Locations SET state = 'AZ' WHERE state = 'Arizona';
    UPDATE Locations SET state = 'CA' WHERE state IN ('California','Eureka');
    UPDATE Locations SET state = 'CO' WHERE state = 'Colorado';
    UPDATE Locations SET state = 'DE' WHERE state = 'Delaware';
    UPDATE Locations SET state = 'FL' WHERE state IN ('Florida', ', FL');
    UPDATE Locations SET state = 'GA' WHERE state IN ('Atlanta', 'Georgia');
    UPDATE Locations SET state = 'IL' WHERE state = 'Illinois';
    UPDATE Locations SET state = 'IN' WHERE state = 'Indiana';
    UPDATE Locations SET state = 'KY' WHERE state = 'Kentucky';
    UPDATE Locations SET state = 'LA' WHERE state IN ('LA / TX', 'Louisana', 'Lousiana', 'Louisiana','Louisiana', 'Luisiana');
    UPDATE Locations SET state = 'MA' WHERE state IN ('Boston', 'Massachusetts', 'MA 02554', 'Whintrop');
    UPDATE Locations SET state = 'ME' WHERE state = 'Maine';
    UPDATE Locations SET state = 'MI' WHERE state IN ('Bay Harbor', 'Michigan', 'SK');
    UPDATE Locations SET state = 'MN' WHERE state = 'Minnesota';
    UPDATE Locations SET state = 'MD' WHERE state = 'Maryland';
    UPDATE Locations SET state = 'MO' WHERE state = 'Missouri';
    UPDATE Locations SET state = 'MS' WHERE state IN ('38701', 'Mississippi', 'MZS');
    UPDATE Locations SET state = 'NC' WHERE state IN ('North Carolina', 'North Caroline', 'Carolina');
    UPDATE Locations SET state = 'NE' WHERE state = 'Nebraska';
    UPDATE Locations SET state = 'NH' WHERE state = 'New Hampshire';
    UPDATE Locations SET state = 'NJ' WHERE state = 'New Jersey';
    UPDATE Locations SET state = 'NV' WHERE state IN ('89701', 'Nevada');
    UPDATE Locations SET state = 'NY' WHERE state = 'New York';
    UPDATE Locations SET state = 'OH' WHERE state = 'Ohio';
    UPDATE Locations SET state = 'OK' WHERE state = 'Oklahoma';
    UPDATE Locations SET state = 'PA' WHERE state = 'Pensilvania';
    UPDATE Locations SET state = 'Puerto Rico' WHERE state IN ('Puerto Rico', 'PR');
    UPDATE Locations SET state = 'SC' WHERE state IN ('South Carolina', 'South Caroline');
    UPDATE Locations SET state = 'TN' WHERE state = 'Tennessee';
    UPDATE Locations SET state = 'TX' WHERE state LIKE '%Texas%' OR state IN ('Chandler', 'Galveston');
    UPDATE Locations SET state = 'US Virgin Islands' WHERE state = 'USVI';
    UPDATE Locations SET state = 'UT' WHERE state = 'Utah';
    UPDATE Locations SET state = 'WA' WHERE state = 'Washington';
    UPDATE Locations SET state = 'WI' WHERE state IN ('Wisconsin', 'WIa', 'Wl');
    UPDATE Locations SET state = 'VA' WHERE state IN ('Virginia', 'Virgina');
    INSERT INTO Categories (categoryId, categoryNumber, categoryName, active) VALUES (28, 5000, 'Other', 1);
    INSERT INTO SubCategories (subCategoryId, categoryId, subCategoryNumber, subCategoryName, active) VALUES
      (500, 28, '5000', 'Various Services', 1);
    UPDATE Locations SET categories = JSON_ARRAY(28) WHERE categories IS NULL;
    UPDATE Locations SET subCategories = JSON_ARRAY(500) WHERE subCategories IS NULL;
    UPDATE Locations L1 SET createdByEmail = (SELECT verifiedByEmail FROM Locations L2 WHERE L1.locationId = L2.locationId)
      WHERE createdByEmail IS NULL;
    UPDATE Locations L SET premiere = 0 WHERE locationId IN (45950,50210,50416,50426,50438,50439,50440,50441,50444,50508);
    UPDATE Locations L SET gold = 0, platinum = 0;
  END DATA_CLEANUP_BLK;
END //
DELIMITER ;

CALL InitLocationCategories();
