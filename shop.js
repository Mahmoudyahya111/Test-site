// Function to handle opening the Cart/Buy modal
function setupPurchaseModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return; // Exit if modal not on page

    const buyBtns = document.querySelectorAll('.buy-btn');
    const customFields = document.getElementById('custom-size-fields');
    let selectedSize = "";

    // 1. OPEN MODAL & Set Data
    buyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // "Grab" data from the button itself
            document.getElementById('modal-product-name').innerText = btn.dataset.name;
            // Update the modal image to match the clicked shirt
            document.getElementById('modal-img').src = btn.parentElement.querySelector('img').src;
            // Display as flex to center the pop-up
            modal.style.display = 'flex';
        });
    });

    // 2. CLOSE MODAL
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 3. SIZE SELECTION LOGIC
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other size buttons
            document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active'); // Add active style to this button
            selectedSize = btn.dataset.size; // Update global selected size variable

            // SHOW/HIDE Custom Fields ONLY if 'Custom' is picked
            if (selectedSize === "Custom") {
                customFields.style.display = 'block';
            } else {
                customFields.style.display = 'none';
            }
        });
    });

    // 4. QUANTITY SELECTION
    const qtyInput = document.getElementById('qty');
    document.getElementById('plus').addEventListener('click', () => qtyInput.value++);
    document.getElementById('minus').addEventListener('click', () => {
        if (qtyInput.value > 1) qtyInput.value--;
    });

    // 5. CONTINUE TO CHECKOUT
    document.getElementById('add-to-cart-confirm').addEventListener('click', () => {
        if (!selectedSize) return alert("Please select a size first.");

        // Create the Order Object
        const orderData = {
            item: document.getElementById('modal-product-name').innerText,
            size: selectedSize,
            quantity: qtyInput.value,
            // If custom, store the unique measurements
            measurements: selectedSize === "Custom" ? {
                chest: document.getElementById('chest').value,
                length: document.getElementById('length').value,
                shoulder: document.getElementById('shoulder').value
            } : "Standard"
        };

        // Save order data to 'LocalStorage' to share with the checkout page
        localStorage.setItem('cgCurrentOrder', JSON.stringify(orderData));
        
        // Redirect user to the payment/invoice page
        window.location.href = "checkout.html";
    });
}

// Ensure the modal setup runs if the elements exist on the page
if (document.querySelector('.buy-btn')) {
    setupPurchaseModal();
}