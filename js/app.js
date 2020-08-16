var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };
  return {
    addItem: function (type, des, val) {
      var newItem, ID;
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    deleteItem: function (type, id) {
      var ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function () {
      calculateTotal("exp");
      calculateTotal("inc");
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentage: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      var allper = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allper;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    testing: function () {
      console.log(data);
    },
  };
})();
budgetController.testing();
var UIController = (function () {
  var DOMstrings = {
    inputType: ".add-type",
    inputDescription: ".add-description",
    inputValue: ".add-value",
    inputBtn: ".add-btn",
    incomeContainer: ".incomes-list",
    expenseContainer: ".expenses-list",
    budgetLabel: ".budget-value",
    incomeLabel: ".budget-income-value",
    expenseLabel: ".budget-expense-value",
    percentageLabel: ".budget-expense-percent",
    container: ".row",
    expensespercentageLabel: ".item-percentage-exp",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    addListItem: function (obj, type) {
      var html, newhtml, element;
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item" id="inc-%id%"><div class="row"><div class="col-lg-6"><div class="income-description"> %description% </div></div><div class="col-lg-6"><div class="item-right"> <div class="inc-value"> %value% <span class="item-percentage">&nbsp; </span> <span class="item-delete"> <button class="income-delete-btn"> <i class="ion-ios-close-outline"></i> </button> </span> </div> </div> </div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expenseContainer;
        html =
          ' <div class="item" id="exp-%id%"> <div class="row">  <div class="col-lg-6"> <div class="expense-description">%description%</div> </div> <div class="col-lg-6"><div class="item-right"><div class="exp-value">  %value% <div class="item-percentage-exp">&nbsp;09% </div> <span class="item-delete">  <button class="expense-delete-btn"> <i class="ion-ios-close-outline"></i></button> </span></div></div> </div></div></div> ';
      }
      newhtml = html.replace("%id%", obj.id);
      newhtml = newhtml.replace("%description%", obj.description);
      newhtml = newhtml.replace("%value%", obj.value);
      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
    },
    deleteListItem: function (selectorID) {
      var el;
      el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          "- - -";
      }
    },
    displayPercentage: function (percentages) {
      var fields = document.querySelectorAll(
        DOMstrings.expensespercentageLabel
      );
      console.log(fields);
      var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };
      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

var controller = (function (budgetCtrl, UICtrl) {
  var setEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };
  var updateBudget = function () {
    budgetCtrl.calculateBudget();
    var budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);
  };
  var updatePercentages = function () {
    budgetCtrl.calculatePercentage();
    var percentages = budgetCtrl.getPercentages();
    console.log(percentages);
    UICtrl.displayPercentage(percentages);
  };
  var ctrlAddItem = function () {
    var input, newItem;
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();
      updateBudget();
      updatePercentages();
    }
  };
  var ctrlDeleteItem = function (event) {
    var itemId, splitId, type, ID;

    itemId =
      event.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .parentNode.parentNode.id;
    console.log(itemId);
    if (itemId) {
      splitId = itemId.split("-");
      type = splitId[0];
      ID = parseInt(splitId[1]);

      budgetCtrl.deleteItem(type, ID);

      UICtrl.deleteListItem(itemId);
      updateBudget();
      updatePercentages();
    }
  };
  return {
    init: function () {
      console.log("Application stat!");
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      }),
        setEventListeners();
    },
  };
})(budgetController, UIController);
controller.init();
