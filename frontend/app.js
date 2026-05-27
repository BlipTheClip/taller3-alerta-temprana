const API_URL = '/api/sensores'; 

const sensorContainer = document.getElementById('sensor-container');
const btnRegister = document.getElementById('btn-register');
const inputSensorName = document.getElementById('sensor-name');
const btnRefresh = document.getElementById('btn-refresh');

async function cargarSensores() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener sensores');
        
        const sensores = await response.json();
        sensorContainer.innerHTML = ''; 
        
        if (sensores.length === 0) {
            sensorContainer.innerHTML = '<p style="text-align: center; color: #64748b;">No hay sensores registrados en la BD.</p>';
            return;
        }

        sensores.forEach(sensor => {
            const isAlerta = sensor.estado.toLowerCase() === 'alerta';
            const statusClass = isAlerta ? 'alerta' : 'normal';
            
            const div = document.createElement('div');
            div.className = `sensor-item ${statusClass}`;
            
            div.innerHTML = `
                <div class="sensor-info">
                    <h3>${sensor.nombre} <span class="badge ${statusClass}">${sensor.estado}</span></h3>
                    <p>ID: ${sensor.id} | Instancia: ${sensor.instancia || 'N/A'}</p>
                </div>
                <div class="sensor-actions">
                    ${isAlerta 
                        ? `<button class="btn btn-sm btn-success" onclick="cambiarEstado(${sensor.id}, 'Normal')">Normalizar</button>`
                        : `<button class="btn btn-sm btn-danger" onclick="cambiarEstado(${sensor.id}, 'Alerta')">Alerta</button>`
                    }
                </div>
            `;
            sensorContainer.appendChild(div);
        });

    } catch (error) {
        console.error('Error:', error);
        sensorContainer.innerHTML = '<p style="text-align: center; color: #ef4444;">Error de conexión con el backend.</p>';
    }
}

async function registrarSensor() {
    const nombre = inputSensorName.value.trim();
    if (!nombre) {
        alert("Por favor, ingresa un nombre para el sensor.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nombre, estado: 'Normal' })
        });
        
        if (response.ok) {
            inputSensorName.value = ''; 
            cargarSensores(); 
        }
    } catch (error) {
        console.error('Error al registrar:', error);
    }
}

async function cambiarEstado(id, nuevoEstado) {
    try {
        // CAMBIAR; Asumiendo que el backend recibe el ID en la URL para actualizar
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT', // O puede ser POST 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        
        if (response.ok) {
            cargarSensores();
        }
    } catch (error) {
        console.error('Error al actualizar estado:', error);
    }
}

btnRegister.addEventListener('click', registrarSensor);
btnRefresh.addEventListener('click', cargarSensores);

document.addEventListener('DOMContentLoaded', cargarSensores);