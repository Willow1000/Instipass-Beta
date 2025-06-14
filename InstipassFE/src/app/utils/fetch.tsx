
const getLogos = async () => {
    try {
    const res = await fetch("http://127.0.0.1:8000/institution/api/institutions", {
        method: "GET",
        headers: {
        "Content-Type": "application/json"
        }
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    return data
    } catch (err) {
    console.error("Fetch failed:", err);
    }
};

let logos = await getLogos()
export {logos}
  
  
 
