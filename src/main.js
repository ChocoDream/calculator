new Vue({
  el: "#app",
  data() {
    return {
      logList: "",
      current: "",
      answer: "",
      operatorClicked: true,
      history: [],
      autosave: false,
    };
  },
  methods: {
    append(number) {
      if (this.operatorClicked) {
        this.current = "";
        this.operatorClicked = false;
      }
      this.animateNumber(`n${number}`);
      this.current = `${this.current}${number}`;
    },
    addtoLog(operator) {
      if (this.operatorClicked == false) {
        this.logList += `${this.current} ${operator} `;
        this.current = "";
        this.operatorClicked = true;
      }
    },
    animateNumber(number) {
      let tl = anime.timeline({
        targets: `#${number}`,
        duration: 250,
        easing: "easeInOutCubic",
      });
      tl.add({ backgroundColor: "#c1e3ff" });
      tl.add({ backgroundColor: "#f4faff" });
    },
    animateOperator(operator) {
      let tl = anime.timeline({
        targets: `#${operator}`,
        duration: 250,
        easing: "easeInOutCubic",
      });
      tl.add({ backgroundColor: "#a6daff" });
      tl.add({ backgroundColor: "#d9efff" });
    },
    clear() {
      this.animateOperator("clear");
      this.current = "";
      this.answer = "";
      this.logList = "";
      this.operatorClicked = false;
    },
    sign() {
      this.animateOperator("sign");
      if (this.current != "") {
        this.current =
          this.current.charAt(0) === "-"
            ? this.current.slice(1)
            : `-${this.current}`;
      }
    },
    percent() {
      this.animateOperator("percent");
      if (this.current != "") {
        this.current = `${parseFloat(this.current) / 100}`;
      }
    },
    dot() {
      this.animateNumber("dot");
      if (this.current.indexOf(".") === -1) {
        this.append(".");
      }
    },
    divide() {
      this.animateOperator("divide");
      this.addtoLog("/");
    },
    times() {
      this.animateOperator("times");
      this.addtoLog("*");
    },
    minus() {
      this.animateOperator("minus");
      this.addtoLog("-");
    },
    plus() {
      this.animateOperator("plus");
      this.addtoLog("+");
    },
    equal() {
      this.animateOperator("equal");
      if (this.operatorClicked == false) {
        this.answer = eval(this.logList + this.current);
        //Added this
        this.addToHistory(this.logList, this.current, this.answer);
      } else {
        this.answer = "WHAT?!!";
      }
    },

    //What we added
    addToHistory(logList, current, answer) {
      const display = `${logList} ${current} = ${answer}`;
      const numbers = this.getNumbers(logList, current);
      const operators = [...logList.match(/[+-/*]/g)];
      const answerObject = { display, answer, numbers, operators };
      this.history.push(answerObject);
    },

    getNumbers(logList, current) {
      const list = [...logList.match(/[0-9]/g)];
      list.push(current);
      return list.map((number) => +number);
    },
  },
});
