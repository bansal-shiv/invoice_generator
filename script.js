
function addRow(item = '', qty = 1, price = 0) {
  const tbody = document.getElementById('invoice-body');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td><input type="text" value="${item}" placeholder="Item name"></td>
    <td><input type="number" min="1" value="${qty}" oninput="updateTotals()"></td>
    <td><input type="number" min="0" value="${price}" oninput="updateTotals()"></td>
    <td class="item-total">0.00</td>
    <td><button onclick="removeRow(this)">X</button></td>
  `;

  tbody.appendChild(row);
  updateTotals();
}

function removeRow(button) {
  const row = button.parentElement.parentElement;
  row.remove();
  updateTotals();
}

function updateTotals() {
  const rows = document.querySelectorAll('#invoice-body tr');
  let subtotal = 0;

  rows.forEach(row => {
    const qty = +row.children[1].children[0].value;
    const price = +row.children[2].children[0].value;
    const total = qty * price;
    row.children[3].textContent = total.toFixed(2);
    subtotal += total;
  });

  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('tax').textContent = tax.toFixed(2);
  document.getElementById('grand-total').textContent = grandTotal.toFixed(2);
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const client = document.getElementById('client-name').value;
  const date = document.getElementById('invoice-date').value;
  let y = 10;

  doc.text(`Invoice`, 90, y);
  y += 10;
  doc.text(`Client Name: ${client}`, 10, y);
  doc.text(`Date: ${date}`, 150, y);
  y += 10;

  doc.text("Item       Qty    Price   Total", 10, y);
  y += 10;

  const rows = document.querySelectorAll('#invoice-body tr');
  rows.forEach(row => {
    const item = row.children[0].children[0].value;
    const qty = row.children[1].children[0].value;
    const price = row.children[2].children[0].value;
    const total = row.children[3].textContent;
    doc.text(`${item}       ${qty}      ${price}     ${total}`, 10, y);
    y += 10;
  });

  y += 10;
  doc.text(`Subtotal: ₹${document.getElementById('subtotal').textContent}`, 10, y);
  doc.text(`Tax: ₹${document.getElementById('tax').textContent}`, 80, y);
  doc.text(`Grand Total: ₹${document.getElementById('grand-total').textContent}`, 140, y);

  doc.save("invoice.pdf");
}

function saveData() {
  const rows = [];
  document.querySelectorAll('#invoice-body tr').forEach(row => {
    const item = row.children[0].children[0].value;
    const qty = row.children[1].children[0].value;
    const price = row.children[2].children[0].value;
    rows.push({ item, qty, price });
  });

  const data = {
    client: document.getElementById('client-name').value,
    date: document.getElementById('invoice-date').value,
    rows
  };

  localStorage.setItem('invoiceData', JSON.stringify(data));
  alert("Data saved!");
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('invoiceData'));
  if (!data) return alert("No data found.");

  document.getElementById('client-name').value = data.client || '';
  document.getElementById('invoice-date').value = data.date || '';

  document.getElementById('invoice-body').innerHTML = '';
  data.rows.forEach(row => addRow(row.item, row.qty, row.price));
  updateTotals();
}
