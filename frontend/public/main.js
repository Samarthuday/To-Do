// Function to show the Add Category modal
function showAddCategoryModal(){
    const modal = document.getElementById("add-category-modal");
    modal.classList.add("show-modal");
}

// Close the Add Category Modal
function closeAddCategoryModal() {
    const modal = document.getElementById('add-category-modal');
    modal.style.display = 'none';
}

// Function to handle the form submission for adding a new category
function submitNewCategory() {
    const categoryName = document.getElementById('new-category-name-input').value;
    const categoryPriority = document.getElementById('new-category-priority').value;

    // Perform validation if necessary

    // Send data to the server
    fetch('add_category.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category: categoryName,
            priority: categoryPriority
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Category added successfully');
            // Fetch and update the category list
            fetchCategoryList();
            closeAddCategoryModal();
        } else {
            alert('Error adding category');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to fetch and update the category list
function fetchCategoryList() {
    fetch('get_categories.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const categorySelect = document.getElementById('category-select');
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category;
                option.textContent = category.category;
                categorySelect.appendChild(option);
            });

            // Update delete category dropdown
            const deleteCategorySelect = document.getElementById('delete-category-select');
            deleteCategorySelect.innerHTML = '';
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category;
                option.textContent = category.category;
                deleteCategorySelect.appendChild(option);
            });
        } else {
            alert('Error fetching categories');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Call fetchCategoryList on page load to populate the category dropdowns
window.onload = fetchCategoryList;
