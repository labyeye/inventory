// Import the necessary Firebase modules
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { db } from "./firebase"; // Assuming your firebase config is in this file

// Function to fetch and display categories
async function fetchCategories() {
  try {
    // Get reference to the categories collection
    const categoriesRef = collection(db, "categories");
    
    // Get all documents from the categories collection
    const querySnapshot = await getDocs(categoriesRef);
    
    // Get the table body element where we'll add our category rows
    const tableBody = document.querySelector(".datanew tbody");
    
    // Clear existing rows
    tableBody.innerHTML = "";
    
    // Check if there are any categories
    if (querySnapshot.empty) {
      tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No categories found</td></tr>`;
      return;
    }
    
    // Loop through each document and create a table row
    querySnapshot.forEach((doc) => {
      const categoryData = doc.data();
      const categoryId = doc.id;
      
      // Format the date (assuming the date is stored as a timestamp in Firestore)
      let dateCreated = "N/A";
      if (categoryData.createdAt) {
        const date = categoryData.createdAt.toDate ? 
                    categoryData.createdAt.toDate() : 
                    new Date(categoryData.createdAt);
        dateCreated = date.toLocaleDateString();
      }
      
      // Create table row HTML
      const row = `
        <tr>
          <td>
            <label class="checkboxs">
              <input type="checkbox" data-id="${categoryId}" />
              <span class="checkmarks"></span>
            </label>
          </td>
          <td class="productimgname">
            <a href="javascript:void(0);" class="product-img">
              <img src="${categoryData.imageUrl || 'assets/img/product/noimage.png'}" alt="product" />
            </a>
            <a href="javascript:void(0);">${categoryData.name || 'Unnamed Category'}</a>
          </td>
          <td>${categoryData.createdBy || 'Unknown'}</td>
          <td>${dateCreated}</td>
          <td>
            <a class="me-3" href="editcategory.html?id=${categoryId}">
              <img src="assets/img/icons/edit.svg" alt="img" />
            </a>
            <a class="me-3 confirm-text" onclick="deleteCategory('${categoryId}')">
              <img src="assets/img/icons/delete.svg" alt="img" />
            </a>
          </td>
        </tr>
      `;
      
      // Add the row to the table
      tableBody.innerHTML += row;
    });
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    alert("Failed to load categories. Please try again later.");
  }
}

// Function to delete a category
async function deleteCategory(categoryId) {
  try {
    // Show confirmation popup using SweetAlert (already included in your HTML)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Import needed for deletion
        const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js");
        
        // Delete the category
        await deleteDoc(doc(db, "categories", categoryId));
        
        // Refresh the category list
        fetchCategories();
        
        Swal.fire(
          'Deleted!',
          'Category has been deleted.',
          'success'
        );
      }
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    Swal.fire(
      'Error!',
      'Failed to delete category. Please try again.',
      'error'
    );
  }
}

// Export the deleteCategory function to make it accessible globally
window.deleteCategory = deleteCategory;

// Call the fetchCategories function when the page loads
document.addEventListener('DOMContentLoaded', fetchCategories);

// Add functionality to the "Add Category" button
document.addEventListener('DOMContentLoaded', () => {
  const addCategoryBtn = document.querySelector('.btn-added');
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => {
      window.location.href = 'addcategory.html';
    });
  }
});

// Add functionality to the "Select All" checkbox
document.addEventListener('DOMContentLoaded', () => {
  const selectAllCheckbox = document.getElementById('select-all');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
      });
    });
  }
});