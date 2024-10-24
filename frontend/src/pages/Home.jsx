
import React, { useRef, useState } from "react";
import "../assets/Home.css";

function Home() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPhotoTaken, setIsPhotoTaken] = useState(false);
    const [location, setLocation] = useState(""); // Agregar estado para ubicación
    const [status, setStatus] = useState("open"); // Agregar estado para estado del ticket

    const startCamera = async () => {
        setLoading(true);
        setError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            setError("Error accessing the camera. Please check your permissions.");
            console.error("Error accessing the camera: ", error);
        } finally {
            setLoading(false);
        }
    };

    const takePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const photoUrl = canvas.toDataURL("image/png");
            setPhoto(photoUrl);
            setIsPhotoTaken(true);
        }
    };

    const createTicket = async () => {
        if (!photo) return; // Asegúrate de que hay una foto

        const ticketData = {
            image: photo,
            description: "Ticket creado automáticamente", // Cambia esto según tus necesidades
            timestamp: new Date().toISOString(), // Fecha y hora actual
            location: location, // Añadir la ubicación
            status: status, // Añadir el estado
        };

        try {
            const response = await fetch("http://localhost:3000/api/tickets", { // Cambia esto por tu URL de API
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticketData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Ticket creado:", result);
                // Puedes limpiar el estado o mostrar un mensaje al usuario
                setPhoto(null); // Limpiar la foto
                setLocation(""); // Limpiar ubicación
                setStatus("open"); // Resetear el estado a 'open'
                alert("Ticket creado con éxito!");
            } else {
                console.error("Error al crear el ticket:", response.statusText);
                alert("Hubo un problema al crear el ticket. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al enviar el ticket:", error);
            alert("Error de red. Por favor, verifica tu conexión.");
        }
    };

    return (
        <div className="home">
            <h1>Welcome to DeskAI</h1>
            <p>Your go-to solution for managing desk reports and issues efficiently.</p>
            <button className="button" onClick={startCamera}>
                {loading ? "Activating Camera..." : "Start Your Ticket"}
            </button>
            {error && <p className="error-message">{error}</p>}
            {!isPhotoTaken ? (
                <video
                    ref={videoRef}
                    autoPlay
                    style={{
                        marginTop: "20px",
                        width: "100%",
                        maxWidth: "600px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
                    <img
                        src={photo}
                        alt="Captured"
                        style={{
                            borderRadius: "10px",
                            maxWidth: "100%",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                    />
                    
                    {/* Añadiendo campos para ubicación y estado */}
                    <div style={{ marginTop: "20px" }}>
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={{ marginLeft: "10px" }}
                        />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={{ marginLeft: "10px" }}
                        >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>

                    <button className="button" style={{ marginTop: "20px" }} onClick={createTicket}>Create Ticket</button>
                </div>
            )}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            {!isPhotoTaken && <button className="button" onClick={takePhoto}>Take Photo</button>}
        </div>
    );
}

export default Home;

