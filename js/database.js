const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SCHEMA = {
    owners: new Set(['id', 'nombre', 'telefono', 'email', 'created_at']),
    spots: new Set(['id', 'number', 'status', 'owner_id']),
    ready: false
};

const OWNER_OPTIONAL_COLS = ['portal', 'vivienda', 'obs'];
const SPOT_OPTIONAL_COLS = ['portal', 'type', 'ownerName', 'ownerPhone', 'ownerEmail', 'brand', 'model', 'plate', 'color', 'created_at'];

function logDbError(context, error) {
    console.error(`[GarageOS] ${context}:`, error.message || error);
}

async function columnExists(table, column) {
    const { error } = await supabaseClient.from(table).select(column).limit(0);
    return !error;
}

async function detectSchema() {
    const ownerChecks = await Promise.all(OWNER_OPTIONAL_COLS.map(async col => [col, await columnExists('owners', col)]));
    const spotChecks = await Promise.all(SPOT_OPTIONAL_COLS.map(async col => [col, await columnExists('spots', col)]));

    ownerChecks.forEach(([col, exists]) => { if (exists) SCHEMA.owners.add(col); });
    spotChecks.forEach(([col, exists]) => { if (exists) SCHEMA.spots.add(col); });
    SCHEMA.ready = true;
    return SCHEMA;
}

function isSchemaComplete() {
    return OWNER_OPTIONAL_COLS.every(col => SCHEMA.owners.has(col))
        && SPOT_OPTIONAL_COLS.every(col => SCHEMA.spots.has(col));
}

function pickRow(table, row) {
    const allowed = SCHEMA[table];
    const out = {};
    for (const [key, value] of Object.entries(row)) {
        if (allowed.has(key) && value !== undefined) out[key] = value;
    }
    return out;
}

async function getSpots() {
    const { data, error } = await supabaseClient.from('spots').select('*').order('id');
    if (error) { logDbError('getSpots', error); throw error; }
    return data || [];
}

async function addSpot(spot) {
    const payload = pickRow('spots', spot);
    const { data, error } = await supabaseClient.from('spots').insert([payload]).select().single();
    if (error) { logDbError('addSpot', error); throw error; }
    return data;
}

async function updateSpot(id, updates) {
    const payload = pickRow('spots', updates);
    const { data, error } = await supabaseClient.from('spots').update(payload).eq('id', id).select().single();
    if (error) { logDbError('updateSpot', error); throw error; }
    return data;
}

async function deleteSpot(id) {
    const { error } = await supabaseClient.from('spots').delete().eq('id', id);
    if (error) { logDbError('deleteSpot', error); throw error; }
    return true;
}

async function deleteSpots(ids) {
    const { error } = await supabaseClient.from('spots').delete().in('id', ids);
    if (error) { logDbError('deleteSpots', error); throw error; }
    return true;
}

async function getOwners() {
    const { data, error } = await supabaseClient.from('owners').select('*').order('id');
    if (error) { logDbError('getOwners', error); throw error; }
    return data || [];
}

async function addOwner(owner) {
    const payload = pickRow('owners', owner);
    const { data, error } = await supabaseClient.from('owners').insert([payload]).select().single();
    if (error) { logDbError('addOwner', error); throw error; }
    return data;
}

async function updateOwner(id, updates) {
    const payload = pickRow('owners', updates);
    const { data, error } = await supabaseClient.from('owners').update(payload).eq('id', id).select().single();
    if (error) { logDbError('updateOwner', error); throw error; }
    return data;
}

async function deleteOwner(id) {
    const { error } = await supabaseClient.from('owners').delete().eq('id', id);
    if (error) { logDbError('deleteOwner', error); throw error; }
    return true;
}

async function deleteOwners(ids) {
    const { error } = await supabaseClient.from('owners').delete().in('id', ids);
    if (error) { logDbError('deleteOwners', error); throw error; }
    return true;
}

function mapSpotFromDb(row) {
    return {
        id: String(row.id),
        number: row.number,
        portal: row.portal || 'SCL 2',
        type: row.type || 'car',
        status: row.status,
        ownerName: row.ownerName || '—',
        ownerPhone: row.ownerPhone || '—',
        ownerEmail: row.ownerEmail || '—',
        brand: row.brand || '—',
        model: row.model || '—',
        plate: row.plate || '—',
        color: row.color || '—',
        createdAt: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
    };
}

function mapSpotToDb(spot) {
    return pickRow('spots', {
        number: spot.number,
        status: spot.status,
        portal: spot.portal,
        type: spot.type,
        ownerName: spot.ownerName,
        ownerPhone: spot.ownerPhone,
        ownerEmail: spot.ownerEmail,
        brand: spot.brand,
        model: spot.model,
        plate: spot.plate,
        color: spot.color
    });
}

function mapOwnerFromDb(row) {
    return {
        id: String(row.id),
        fullName: row.nombre,
        phone: row.telefono || '—',
        email: row.email || '—',
        portal: row.portal || 'SCL 2',
        vivienda: row.vivienda || '—',
        obs: row.obs || '',
        createdAt: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
    };
}

function mapOwnerToDb(owner) {
    return pickRow('owners', {
        nombre: owner.fullName,
        telefono: owner.phone === '—' ? null : owner.phone,
        email: owner.email === '—' ? null : owner.email,
        portal: owner.portal,
        vivienda: owner.vivienda === '—' ? null : owner.vivienda,
        obs: owner.obs || null
    });
}
