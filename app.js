/*
DATA Module
*/
//1. get input data
let budgetControler = (function() {
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(element => {
      sum += element.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, description, val) {
      var newItem, ID;
      //create an ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Create a New Item Based on "inc" or "exp" type
      if (type === "exp") {
        newItem = new Expense(ID, description, val);
      } else if (type === "inc") {
        newItem = new Income(ID, description, val);
      }
      //Push the item into array
      data.allItems[type].push(newItem);
      //Return the new element.
      return newItem;
    },
    calculateBudget: function() {
      // calculate total inncome and expences
      calculateTotal("exp");
      calculateTotal("inc");
      // calculate the budget
      data.budget = data.totals.inc - data.totals.exp;
      // calculate percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() {
      console.log(data);
    }
  };
})();

//********************************

/*
UI Module

*/

let UIControler = (function() {
  DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBTN: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      // create Html string with placeholder text
      let html, newHtml;
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } // Replace the placeholder with data

      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    clearFields: function() {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//********************************

/*
Controler Module
*/
// add event listner
let controler = (function(budgetC, UIctrl) {
  let setupEventListners = function() {
    let DOM = UIctrl.getDOMstrings();
    document
      .querySelector(DOM.inputBTN)
      .addEventListener("click", cntrlAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        cntrlAddItem();
      }
    });
  };
  let updateBudget = function() {
    //  Calculate the budget
    budgetC.calculateBudget();
    //  RETURN
    var budget = budgetC.getBudget();
    //  Display
    UIctrl.displayBudget(budget);
  };

  let cntrlAddItem = function() {
    let input, newItem;
    // get the field input data

    input = UIctrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // add data to budget
      newItem = budgetC.addItem(input.type, input.description, input.value);
      // add to UI
      UIctrl.addListItem(newItem, input.type);
      // clear fields
      UIctrl.clearFields();
      // Calculate and Update budget
      updateBudget();
    }
  };

  return {
    init: function() {
      console.log("Aplication Had Started");
      setupEventListners();
      UIctrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
    }
  };
})(budgetControler, UIControler);

//********************************
controler.init();
