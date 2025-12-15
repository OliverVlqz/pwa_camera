navigator.serviceWorker
  .register('./sw.js')
  .then((registration) => {
    console.log('Service Worker registered with scope:', registration.scope)
  })
  .catch((error) => {
    console.log('Service Worker registration failed:', error)
  })

const openCameraBtn = document.getElementById('openCamera')
const cameraContainer = document.getElementById('cameraContainer')
const video = document.getElementById('video')
const takePhotoBtn = document.getElementById('takePhoto')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let stream = null

async function openCamera() {
  try {
    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 320 },
        height: { ideal: 240 },
      },
    }
    stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.srcObject = stream
    cameraContainer.style.display = 'block'
    openCameraBtn.textContent = 'Camara abierta'
    openCameraBtn.disabled = true
    console.log('Cámara abierta')
  } catch (error) {
    console.error('Error al abrir la cámara:', error)
  }
}
function takePhoto() {
  if (!stream) {
    console.error('La cámara no está abierta')
    return
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  const imageDataURL = canvas.toDataURL('image/png')
  console.log('Foto tomada:', imageDataURL)
  closeCamera()
}
function closeCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
    cameraContainer.style.display = 'none'
    openCameraBtn.textContent = 'Abrir cámara'
    openCameraBtn.disabled = false
    console.log('Cámara cerrada')
  }
}

openCameraBtn.addEventListener('click', openCamera)
takePhotoBtn.addEventListener('click', takePhoto)

window.addEventListener('beforeunload', () => closeCamera())
