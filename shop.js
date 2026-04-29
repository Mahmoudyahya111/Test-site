// Function to handle opening the Cart/Buy modal
//function setupPurchaseModal() {
//     const modal = document.getElementById('product-modal');
//     if (!modal) return; // Exit if modal not on page

//     const buyBtns = document.querySelectorAll('.buy-btn');
//     const customFields = document.getElementById('custom-size-fields');
//     let selectedSize = "";

//     // 1. OPEN MODAL & Set Data
//     buyBtns.forEach(btn => {
//         btn.addEventListener('click', () => {
//             // "Grab" data from the button itself
//             document.getElementById('modal-product-name').innerText = btn.dataset.name;
//             // Update the modal image to match the clicked shirt
//             document.getElementById('modal-img').src = btn.parentElement.querySelector('img').src;
//             // Display as flex to center the pop-up
//             modal.style.display = 'flex';
//         });
//     });

//     // 2. CLOSE MODAL
//     document.querySelector('.close-modal').addEventListener('click', () => {
//         modal.style.display = 'none';
//     });

//     // 3. SIZE SELECTION LOGIC
//     document.querySelectorAll('.size-option').forEach(btn => {
//         btn.addEventListener('click', () => {
//             // Remove active class from other size buttons
//             document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
//             btn.classList.add('active'); // Add active style to this button
//             selectedSize = btn.dataset.size; // Update global selected size variable

//             // SHOW/HIDE Custom Fields ONLY if 'Custom' is picked
//             if (selectedSize === "Custom") {
//                 customFields.style.display = 'block';
//             } else {
//                 customFields.style.display = 'none';
//             }
//         });
//     });

//     // 4. QUANTITY SELECTION
//     const qtyInput = document.getElementById('qty');
//     document.getElementById('plus').addEventListener('click', () => qtyInput.value++);
//     document.getElementById('minus').addEventListener('click', () => {
//         if (qtyInput.value > 1) qtyInput.value--;
//     });

//     // 5. CONTINUE TO CHECKOUT
//     document.getElementById('add-to-cart-confirm').addEventListener('click', () => {
//         if (!selectedSize) return alert("Please select a size first.");

//         // Create the Order Object
//         const orderData = {
//             item: document.getElementById('modal-product-name').innerText,
//             size: selectedSize,
//             quantity: qtyInput.value,
//             // If custom, store the unique measurements
//             measurements: selectedSize === "Custom" ? {
//                 chest: document.getElementById('chest').value,
//                 length: document.getElementById('length').value,
//                 shoulder: document.getElementById('shoulder').value
//             } : "Standard"
//         };

//         // Save order data to 'LocalStorage' to share with the checkout page
//         localStorage.setItem('cgCurrentOrder', JSON.stringify(orderData));
        
//         // Redirect user to the payment/invoice page
//         window.location.href = "checkout.html";
//     });
// }

// // Ensure the modal setup runs if the elements exist on the page
// if (document.querySelector('.buy-btn')) {
//     setupPurchaseModal();
// }


// 1. INITIALIZE EMAILJS
(function() {
    try {
        emailjs.init({
            publicKey: "YOUR_PUBLIC_KEY", // REPLACE THIS
        });
    } catch (e) {
        console.error("EmailJS Init Failed:", e);
    }
})();

function setupPurchaseModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return; 

    const buyBtns = document.querySelectorAll('.buy-btn');
    const customFields = document.getElementById('custom-size-fields');
    let selectedSize = "";

    // 1. OPEN MODAL
    buyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nameEl = document.getElementById('modal-product-name');
            if (nameEl) nameEl.innerText = btn.dataset.name || "Product";
            
            const modalImg = document.getElementById('modal-img');
            const parentImg = btn.parentElement.querySelector('img');
            if (modalImg && parentImg) modalImg.src = parentImg.src;
            
            modal.style.display = 'flex';
        });
    });

    // 2. CLOSE MODAL
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 3. SIZE SELECTION
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
            if (customFields) {
                customFields.style.display = (selectedSize === "Custom") ? 'block' : 'none';
            }
        });
    });

    // 4. QUANTITY SELECTION (Using Optional Chaining to prevent crashes)
    const qtyInput = document.getElementById('qty');
    document.getElementById('plus')?.addEventListener('click', () => { if(qtyInput) qtyInput.value++; });
    document.getElementById('minus')?.addEventListener('click', () => {
        if (qtyInput && qtyInput.value > 1) qtyInput.value--;
    });

    // 5. CONTINUE TO CHECKOUT
    const confirmBtn = document.getElementById('add-to-cart-confirm');
    confirmBtn?.addEventListener('click', () => {
        if (!selectedSize) return alert("Please select a size first.");

        const orderData = {
            item: document.getElementById('modal-product-name')?.innerText || "Unknown",
            size: selectedSize,
            quantity: qtyInput?.value || 1,
            measurements: selectedSize === "Custom" ? 
                `C: ${document.getElementById('chest')?.value}, L: ${document.getElementById('length')?.value}, S: ${document.getElementById('shoulder')?.value}` : 
                "Standard"
        };

        localStorage.setItem('cgCurrentOrder', JSON.stringify(orderData));
        
        confirmBtn.innerText = "Sending...";
        confirmBtn.disabled = true;

        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", orderData)
            .then(() => { window.location.href = "checkout.html"; })
            .catch((err) => {
                console.error("EmailJS Error:", err);
                window.location.href = "checkout.html"; 
            });
    });
}
// Global check to see if the script loaded
console.log("Common Ground Script Loaded");
setupPurchaseModal();
