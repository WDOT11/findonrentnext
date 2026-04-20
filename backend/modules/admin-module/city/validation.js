const { pool } = require("../../../config/connection");

/** add new city validation Coded by Vishnu July 05 2025 */
const ValidateaddnewCity = (req, res, next) => {
    const { city_name, city_slug, state_id } = req.body;

    /** Validate required fields */
    if (!city_name || !city_slug || !state_id) {
        return GLOBAL_ERROR_RESPONSE("City Name, City Slug, and State ID are required", {}, res);
    }

    /** SQL query to check if the city_slug already exists */
    // const checkSlugQuery = `
    //     SELECT * FROM roh_cities WHERE city_slug = ? AND active = 1`;
    
    const checkSlugQuery = `
        SELECT * FROM roh_cities WHERE city_slug = ?`;

    /** Execute the query to check if the slug already exists */
    pool.query(checkSlugQuery, [city_slug], (err, result) => {
        if (err) {
            return GLOBAL_ERROR_RESPONSE("Error checking for duplicate city slug", err, res);
        }

        /** If a city with this slug exists, return an error */
        if (result.length > 0) {
            return GLOBAL_ERROR_RESPONSE("City with this slug already exists", {}, res);
        }

        /** SQL query to check if the state_id exists and is active in the roh_states table */
        const checkStateQuery = `
            SELECT * FROM roh_states WHERE state_id = ? AND active = 1
        `;

        /** Execute the query to check if the state_id is valid and active */
        pool.query(checkStateQuery, [state_id], (err, result) => {
            if (err) {
                return GLOBAL_ERROR_RESPONSE("Error checking state ID", err, res);
            }

            /** If the state_id does not exist or is not active, return an error */
            if (result.length === 0) {
                return GLOBAL_ERROR_RESPONSE("Invalid or inactive State ID", {}, res);
            }

            /** If both validations pass, proceed to the next middleware/controller */
            next();
        });
    });
};

/** Get all cities validation Coded by Vishnu July 05 2025 */
const ValidategetallCity = (req, res, next) => {
    const { page, limit } = req.body;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (!pageNum || !limitNum || pageNum <= 0 || limitNum <= 0) {
        return GLOBAL_ERROR_RESPONSE("Page number and limit must be positive integers", {}, res);
    }

    next();
};


/** Edit city validation Coded by Vishnu July 05 2025 */
const ValidateeditCity = (req, res, next) => {
    const { city_id, city_name, city_slug, state_id } = req.body;

    /** Validate required fields */
    if (!city_id || !city_name || !city_slug || !state_id) {
        return GLOBAL_ERROR_RESPONSE("City ID, City Name, City Slug, and State ID are required", {}, res);
    }

    /** SQL query to check if the state_id exists in the roh_states table */
    const stateCheckQuery = `
        SELECT * FROM roh_states WHERE state_id = ?`;

    // const stateCheckQuery = `
    //     SELECT * FROM roh_states WHERE state_id = ? AND active = 1
    // `;

    /** Proceed with checking if the state_id exists in roh_states */
    pool.query(stateCheckQuery, [state_id], (err, result) => {
        if (err) {
            return GLOBAL_ERROR_RESPONSE("Error checking state ID", err, res);
        }

        /** If no matching state is found, return an error */
        if (result.length === 0) {
            return GLOBAL_ERROR_RESPONSE("Invalid State ID. The state ID does not exist or is inactive.", {}, res);
        }

        /** SQL query to check if the city_id exists in the roh_cities table */
        const cityCheckQuery = `
            SELECT * FROM roh_cities WHERE city_id = ?`;
        // const cityCheckQuery = `
        //     SELECT * FROM roh_cities WHERE city_id = ? AND active = 1
        // `;

        /** Proceed with checking if the city_id exists in roh_cities */
        pool.query(cityCheckQuery, [city_id], (err, result) => {
            if (err) {
                return GLOBAL_ERROR_RESPONSE("Error checking city ID", err, res);
            }

            /** If no matching city is found, return an error */
            if (result.length === 0) {
                return GLOBAL_ERROR_RESPONSE("Invalid City ID. The city ID does not exist or is inactive.", {}, res);
            }

            /** If all validations pass, proceed to the next middleware/controller */
            next();
        });
    });
};

/** Delete city validation Coded by Vishnu July 05 2025 */
const ValidateDeleteCity = (req, res, next) => {
    const { city_id } = req.body;

    /** Validate required fields */
    if (!city_id) {
        return GLOBAL_ERROR_RESPONSE("City ID is required", {}, res);
    }

    /** SQL query to check if the city_id exists in the roh_cities table */
    const cityCheckQuery = `
        SELECT * FROM roh_cities WHERE city_id = ? AND active = 1
    `;

    /** Proceed with checking if the city_id exists and is active in roh_cities */
    pool.query(cityCheckQuery, [city_id], (err, result) => {
        if (err) {
            return GLOBAL_ERROR_RESPONSE("Error checking city ID", err, res);
        }

        /** If no matching city is found, return an error */
        if (result.length === 0) {
            return GLOBAL_ERROR_RESPONSE("Invalid City ID. The city ID does not exist or is inactive.", {}, res);
        }

        /** If all validations pass, proceed to the next middleware/controller */
        next();
    });
};

/** get single city all details Coded by Vishnu July 24 2025 */
const ValidategetsingleCity = (req, res, next) => {
    const { city_id } = req.body;

    /** Validate required fields */
    if (!city_id) {
        return GLOBAL_ERROR_RESPONSE("City ID is required", {}, res);
    }

    /** SQL query to check if the city_id exists in the roh_cities table */
    const cityCheckQuery = `
        SELECT * FROM roh_cities WHERE city_id = ?`;

    //     const cityCheckQuery = `
    //     SELECT * FROM roh_cities WHERE city_id = ? AND active = 1
    // `;

    /** Proceed with checking if the city_id exists and is active in roh_cities */
    pool.query(cityCheckQuery, [city_id], (err, result) => {
        if (err) {
            return GLOBAL_ERROR_RESPONSE("Error checking city ID", err, res);
        }

        /** If no matching city is found, return an error */
        if (result.length === 0) {
            return GLOBAL_ERROR_RESPONSE("Invalid City ID. The city ID does not exist or is inactive.", {}, res);
        }

        /** If all validations pass, proceed to the next middleware/controller */
        next();
    });
};


module.exports = { ValidateaddnewCity, ValidategetallCity, ValidateeditCity, ValidateDeleteCity, ValidategetsingleCity};
