const { createClient } = require("@supabase/supabase-js");
require("dotenv").config("../.env");

const { SUPABASE_URL, SUPABASE_KEY } = process.env;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
