import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { db, auth } from "./firebase.js";

export async function initSubcategoryPage() {
  console.log("Initializing subcategory page...");
  try {
    // Load the parent categories
    await loadParentCategories();

    // Set up form submission
    const submitBtn = document.querySelector(".btn-submit");
    if (submitBtn) {
      console.log("Setting up submit button listener");
      submitBtn.addEventListener("click", addSubcategory);
    } else {
      console.error("Submit button not found");
    }
  } catch (error) {
    console.error("Error in initialization:", error);
  }
}

async function loadParentCategories() {
  console.log("Loading parent categories...");
  try {
    const categorySelect = document.querySelector(".form-group select");
    if (!categorySelect) {
      console.error("Category select element not found");
      return;
    }

    // Clear existing options except the first one
    while (categorySelect.options.length > 1) {
      categorySelect.remove(1);
    }

    // Get categories from Firestore
    console.log("Fetching categories from Firestore...");
    const categoriesSnapshot = await getDocs(collection(db, "categories"));

    console.log(`Found ${categoriesSnapshot.size} categories`);

    categoriesSnapshot.forEach((doc) => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = data.name;
      categorySelect.appendChild(option);
    });

    // Initialize Select2 if it's being used
    if (typeof $ !== "undefined" && $.fn.select2) {
      $(".select").select2({
        placeholder: "Choose Category",
      });
    }

    console.log("Parent categories loaded successfully");
  } catch (error) {
    console.error("Error loading categories:", error);
    showAlert("error", "Failed to load categories: " + error.message);
  }
}

async function addSubcategory() {
  console.log("Adding subcategory...");
  try {
    const categorySelect = document.querySelector(".form-group select");
    const subcategoryNameInput = document.querySelector(
      '.form-group input[type="text"]'
    );

    if (!categorySelect || !subcategoryNameInput) {
      console.error("Form elements not found");
      showAlert("error", "Form elements not found");
      return;
    }

    const parentCategoryId = categorySelect.value;
    const subcategoryName = subcategoryNameInput.value.trim();

    console.log(
      `Parent category: ${parentCategoryId}, Subcategory name: ${subcategoryName}`
    );

    // Validate inputs
    if (parentCategoryId === "Choose Category") {
      console.log("Parent category not selected");
      showAlert("warning", "Please select a parent category");
      return;
    }

    if (!subcategoryName) {
      console.log("Subcategory name is empty");
      showAlert("warning", "Please enter a subcategory name");
      return;
    }

    // Check if subcategory already exists
    console.log("Checking for existing subcategories...");
    const existingQuery = query(
      collection(db, "subcategories"),
      where("name", "==", subcategoryName),
      where("parentCategoryId", "==", parentCategoryId)
    );

    try {
      const existingSnapshot = await getDocs(existingQuery);

      if (!existingSnapshot.empty) {
        console.log("Subcategory already exists");
        showAlert(
          "warning",
          "A subcategory with this name already exists for the selected category"
        );
        return;
      }
    } catch (queryError) {
      console.error("Error checking existing subcategories:", queryError);
      throw new Error(`Query error: ${queryError.message}`);
    }

    // Add subcategory to Firestore
    const user = auth.currentUser;
    console.log(`Current user: ${user ? user.uid : "none"}`);

    if (!user) {
      console.warn("No user logged in, but proceeding anyway");
    }

    // Create subcategory document
    const subcategoryData = {
      name: subcategoryName,
      parentCategoryId: parentCategoryId,
      createdBy: user ? user.uid : null,
      createdAt: serverTimestamp(),
    };

    console.log("Saving subcategory to Firestore:", subcategoryData);

    try {
      const docRef = await addDoc(
        collection(db, "subcategories"),
        subcategoryData
      );
      console.log("Subcategory added with ID:", docRef.id);

      showAlert("success", "Subcategory added successfully");

      // Clear form
      subcategoryNameInput.value = "";
      categorySelect.value = "Choose Category";
      if (typeof $ !== "undefined" && $.fn.select2) {
        $(".select").trigger("change");
      }
    } catch (addError) {
      console.error("Error adding document to Firestore:", addError);
      throw new Error(`Firestore add error: ${addError.message}`);
    }
  } catch (error) {
    console.error("Error adding subcategory:", error);
    showAlert("error", `Failed to add subcategory: ${error.message}`);
  }
}

function showAlert(type, message) {
  console.log(`Showing alert: ${type} - ${message}`);

  if (typeof Swal !== "undefined") {
    // Use SweetAlert if available
    Swal.fire({
      icon: type,
      title:
        type === "success"
          ? "Success"
          : type === "warning"
          ? "Warning"
          : "Error",
      text: message,
      showConfirmButton: true,
    });
  } else {
    // Fallback to alert
    alert(message);
  }
}

// Check if Firestore is configured properly
try {
  console.log("Testing Firestore connection...");
  getDocs(collection(db, "test"))
    .then(() => {
      console.log("Firestore connection successful");
    })
    .catch((error) => {
      console.error("Firestore connection test failed:", error);
    });
} catch (error) {
  console.error("Error testing Firestore:", error);
}
