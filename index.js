
console.log("GUNDEWINE TRADING website loaded!");

// Get the search input and category dropdown
const productSearch = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");

// Get all product cards
const productCards = document.querySelectorAll(".product-card");

// Get the message shown when there are no matching products
const noProducts = document.getElementById("noProducts");

// Filter the products
function filterProducts() {
    const searchText = productSearch.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    let visibleCount = 0;

    productCards.forEach(function (card) {
        const productName = card.querySelector("h3").textContent.toLowerCase();
        const productDescription = card.querySelector("p").textContent.toLowerCase();
        const productCategory = card.dataset.category;

        const matchesSearch =
            productName.includes(searchText) ||
            productDescription.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.hidden = false;
            visibleCount++;
        } else {
            card.hidden = true;
        }
    });

    noProducts.hidden = visibleCount !== 0;
}

// Run the filter whenever the visitor types or changes category
productSearch.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

const inquiryForm = document.getElementById("inquiryForm");
const formMessage = document.getElementById("formMessage");

if (inquiryForm && formMessage) {
    inquiryForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!inquiryForm.checkValidity()) {
            inquiryForm.reportValidity();
            return;
        }

        formMessage.textContent =
            "Your form passed validation! The next step is connecting it to our server.";

        inquiryForm.reset();
    });
}

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        formStatus.textContent = "Sending your inquiry...";

        const formData = new FormData(contactForm);

        const inquiry = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message")
        };

        try {
            const response = await fetch(
                "http://localhost:3000/api/inquiries",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(inquiry)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Could not send inquiry.");
            }

            formStatus.textContent = result.message;
            contactForm.reset();
        } catch (error) {
            formStatus.textContent =
                "Could not send your inquiry. Please try again.";
            console.error(error);
        }
    });
}

const inquiryForm = document.getElementById("inquiryForm");
const formMessage = document.getElementById("formMessage");

inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formMessage.textContent = "Sending your inquiry...";

    const inquiry = {
        name: document.getElementById("customerName").value.trim(),
        email: document.getElementById("customerEmail").value.trim(),
        message: [
            "Inquiry type: " + document.getElementById("inquiryType").value,
            "Company: " + document.getElementById("companyName").value.trim(),
            "Product: " + document.getElementById("productInterest").value.trim(),
            "Estimated quantity: " + document.getElementById("quantity").value.trim(),
            "Message: " + document.getElementById("message").value.trim()
        ].join("\n")
    };

    try {
        const response = await fetch(
            "http://localhost:3000/api/inquiries",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inquiry)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not submit inquiry.");
        }

        formMessage.textContent = "Thank you! Your inquiry was submitted successfully.";
        inquiryForm.reset();

    } catch (error) {
        console.error("Inquiry submission failed:", error);
        formMessage.textContent =
            "Could not submit your inquiry. Please try again.";
    }
});
