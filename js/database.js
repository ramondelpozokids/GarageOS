const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// VEHICLES
async function getVehicles() {
    const { data, error } = await supabase.from('vehicles').select('*').order('id');
    return error ? [] : data;
}
async function addVehicle(v) {
    const { data, error } = await supabase.from('vehicles').insert([v]).select().single();
    return error ? null : data;
}
async function updateVehicle(id, updates) {
    const { data, error } = await supabase.from('vehicles').update(updates).eq('id', id).select().single();
    return error ? null : data;
}
async function deleteVehicle(id) {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    return !error;
}

// MOTORCYCLES
async function getMotorcycles() {
    const { data, error } = await supabase.from('motorcycles').select('*').order('id');
    return error ? [] : data;
}
async function addMotorcycle(m) {
    const { data, error } = await supabase.from('motorcycles').insert([m]).select().single();
    return error ? null : data;
}
async function updateMotorcycle(id, updates) {
    const { data, error } = await supabase.from('motorcycles').update(updates).eq('id', id).select().single();
    return error ? null : data;
}
async function deleteMotorcycle(id) {
    const { error } = await supabase.from('motorcycles').delete().eq('id', id);
    return !error;
}

// OWNERS
async function getOwners() {
    const { data, error } = await supabase.from('owners').select('*').order('id');
    return error ? [] : data;
}
async function addOwner(o) {
    const { data, error } = await supabase.from('owners').insert([o]).select().single();
    return error ? null : data;
}
async function updateOwner(id, updates) {
    const { data, error } = await supabase.from('owners').update(updates).eq('id', id).select().single();
    return error ? null : data;
}
async function deleteOwner(id) {
    const { error } = await supabase.from('owners').delete().eq('id', id);
    return !error;
}

// SPOTS
async function getSpots() {
    const { data, error } = await supabase.from('spots').select('*').order('id');
    return error ? [] : data;
}
async function addSpot(s) {
    const { data, error } = await supabase.from('spots').insert([s]).select().single();
    return error ? null : data;
}
async function updateSpot(id, updates) {
    const { data, error } = await supabase.from('spots').update(updates).eq('id', id).select().single();
    return error ? null : data;
}
async function deleteSpot(id) {
    const { error } = await supabase.from('spots').delete().eq('id', id);
    return !error;
}