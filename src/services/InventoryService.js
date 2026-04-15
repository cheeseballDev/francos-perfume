const API_URL = "http://localhost:5019/api"

export const fetchAllInventory = async () => {
    const response = await fetch(`${API_URL}/inventory/displayAll`);

    if (!response.ok) throw new Error(await response.text());

    return await response.json();
}

export const updateStock = async () => {

}

