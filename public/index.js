//0)conexion socket (front)
const socket = io();
socket.on('connect', () => {
  console.log('me conecteeeee');
});

//2) usuario completa form con producto nuevo. El envio lo hace el onclick en el form
const sendProd = () => {
  const title = document.getElementById('inputTitle').value;
  const price = document.getElementById('inputPrice').value;
  const thumbnail = document.getElementById('inputThumbnail').value;
  socket.emit('newProd', { title: title, price: price, thumbnail: thumbnail });
  //dejo el form en blanco
  document.getElementById('inputTitle').value = '';
  document.getElementById('inputPrice').value = '';
  document.getElementById('inputThumbnail').value = '';
  return;
};

const render = (data) => {
  let html = '';
  data.forEach((obj) => {
    html += `<tr>
    <td class='align-middle text-center'>${obj.title}</td>
    <td class='align-middle text-center'>$${obj.price}</td>
    <td class='align-middle text-center'><img src='${obj.thumbnail}' width='50' height='auto' class='img-fluid' /></td>
    </tr>`;
  });
  document.getElementById('productos').innerHTML = html;
};

const renderProdTest = (data) => {
  let html = '';
  data.forEach((obj) => {
    html += `<tr>
    <td class='align-middle text-center'>${obj.title}</td>
    <td class='align-middle text-center'>$${obj.price}</td>
    <td class='align-middle text-center'><img src='${obj.thumbnail}' width='50' height='auto' class='img-fluid' /></td>
    </tr>`;
  });
  document.getElementById('fakeProducts').innerHTML = html;
};

//4) atrapar desde el front el array de productos actualizado
socket.on('products', (data) => {
  render(data);
});
socket.on('prod-test', (data) => {
  renderProdTest(data);
});

//chat
const fyh = new Date().toLocaleDateString() + new Date().toTimeString();

const sendMsg = () => {
  const email = document.getElementById('input-email').value;
  const msgParaEnvio = document.getElementById('input-msg').value;
  socket.emit('newMsg', { email: email, fyh: fyh, mensaje: msgParaEnvio });
  document.getElementById('input-msg').value = '';
  return;
};

const chatRender = (data) => {
  let html = '';
  data.forEach((msg) => {
    html += ` 
    <li style="display: flex; flex-direction:row; ">
            <div id="autor" style="font-weight: bold; color:blue;" >
                ${msg.email} <span style="color: brown; font-weight:normal; margin-left:5px;">  ${fyh}  :</span> 
            </div>
            <div id="msj"  style="color: green; font-style: italic; margin-left:15px;">
               ${msg.mensaje}
            </div>
        </li>
    `;
  });
  document.getElementById('fullChat').innerHTML = html;
};

socket.on('msgs', (data) => {
  chatRender(data);
});
