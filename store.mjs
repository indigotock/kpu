const LOCAL_STORAGE_KEY = "KPU_STORE"


function getUid(length = 8) {
    // Generate list of characters (ascii 32-127)
    const chars = Array(127 - 32).map(e => e + 32)
    return Array(length).fill(1).map(e => Math.floor(Math.random() * chars.length)).map(e => chars[e])
}

let data = {
    time: 0,
    files: [{
        id: getUid()
    }]
}

function updateStorage() {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    if (getStorage() < Date.now()) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
    }
}

function getStorage() {
    if (!isDataStored()) {
        updateStorage()
    }
}

function isDataStored() {
    try {
        return localStorage.getItem(LOCAL_STORAGE_KEY) && localStorage.getItem(LOCAL_STORAGE_KEY).length >= 0
    } catch (e) {
        console.log("Error loading storage data :/")
        console.log("Error loading storage data :/", e)
        updateStorage()
        return false
    }
}

export function saveFile(title, code) {

}