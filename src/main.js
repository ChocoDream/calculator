// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ3LP6wcliNJOrpvKfI3yntmOHDQxzXjU",
  authDomain: "math-calculator-d6d9c.firebaseapp.com",
  projectId: "math-calculator-d6d9c",
  storageBucket: "math-calculator-d6d9c.appspot.com",
  messagingSenderId: "148637567422",
  appId: "1:148637567422:web:41100890b0d84cd83d11ef",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

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
      input: "",
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
    async addToHistory(logList, current, answer) {
      const display = `${logList} ${current} = ${answer}`;
      const numbers = this.getNumbers(logList, current);
      const operators = [...logList.match(/[+-/*]/g)];
      const answerObject = { display, answer, numbers, operators };
      await this.saveToFirebase(answerObject);
      this.history.push(answerObject);
    },

    getNumbers(logList, current) {
      const list = [...logList.match(/[0-9]/g)];
      list.push(current);
      return list.map((number) => +number);
    },

    async saveToFirebase(object) {
      await db
        .collection("calculations")
        .add(object)
        .then((docRef) => {
          console.info("Document successfully written: ", docRef.id);
        })
        .catch((error) => console.warn(error));
    },

    async readFromFirebase() {
      let items = [];
      await db
        .collection("calculations")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            items.push(doc.data());
          });
        });
      return items;
    },

    onInputChange() {
      console.log(this.input);
    },

    /*     async saveToDatabase() {
      const testObj = {
        hello: "world",
        numbers: 12345,
        testArray: ["Karlsson", "Bert", "Dunderhumor"],
      };

      db.collection("test")
        .add(testObj)
        .then(function (docRef) {
          console.log("Document written with Id: ", docRef.id);
        })
        .catch(function (error) {
          console.warn("Couldn't write document: ", error);
        });
    },

    async readFromDatabase() {
      db.collection("test")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
          });
        });
    }, */
  },
  async created() {
    this.history = await this.readFromFirebase(this.input);
  },
});
