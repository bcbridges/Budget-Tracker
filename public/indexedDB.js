const db;

// get connection to the database defn in server.js
const request = indexedDB.open("budget-tracker", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    updateTransaction();
  }
};

request.onerror = function (event) {
  console.log("Request Error - " + event.target.errorCode);
};

// Record the transaciton to the db variable if there is no internet.
function saveRecord(data) {
  const transaction = db.transaction(["pending"], "readwrite");
  const pending = transaction.objectStore("pending");

  pending.add(data);
}

function updateTransaction() {
  const transaction = db.transaction(["pending"], "readwrite");

  const pending = transaction.objectStore("pending");

  const getAll = pending.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const pending = transaction.objectStore("pending");
          pending.clear();
          location.reload();
          alert("All transactions have been saved.")
        });
    }
  };
}

// Listen for internet connection, update the transactions afterward
window.addEventListener("online", updateTransaction);
