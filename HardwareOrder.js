const Order = require("./Order");

const OrderState = Object.freeze({
  GREETING: Symbol("greeting"),
  ITEM1: Symbol("item1"),
  ITEM2GREETING: Symbol("item2greeting"),
  ITEM2: Symbol("item2"),
  PROPANE: Symbol("propane"),
  ICEMELT: Symbol("iceMelt"),
});

module.exports = class HardwareOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.GREETING;
    this.item1 = ""; //menu has 3 items. will validate which is ordered based on user input
    this.item2 = ""; //option to order a second item
    this.propane = ""; //2 upsell items
    this.iceMelt = "";
    this.total = 0;
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.GREETING:
        this.stateCur = OrderState.ITEM1;
        aReturn.push(
          `Welcome to Home Hardware Curbside. For a list of all available items, please visit: ${this.sUrl}/payment/${this.sNumber}/`
        );
        aReturn.push(
          "What item would you like to order? \n 1. Snow Shovel \n 2. Broom \n 3.Garbage Bin"
        ); //3 main menu items available for purchase
        break;
      case OrderState.ITEM1:
        if (sInput.toLowerCase() == "snow shovel") {
          //validating menu item
          this.item1 = sInput; //only saving item input if its valid
          this.stateCur = OrderState.ITEM2GREETING;
          aReturn.push(
            "Would you like to add a second item to your order? \n 1. YES \n 2. NO"
          );
        } else if (sInput.toLowerCase() == "broom") {
          this.item1 = sInput;
          this.stateCur = OrderState.ITEM2GREETING;
          aReturn.push(
            "Would you like to add a second item to your order? \n 1. YES \n 2. NO"
          );
        } else if (sInput.toLowerCase() == "garbage bin") {
          this.item1 = sInput;
          this.stateCur = OrderState.ITEM2GREETING;
          aReturn.push(
            "Would you like to add a second item to your order? \n 1. YES \n 2. NO"
          );
        } else {
          aReturn.push("Please enter a valid item to purchase"); //error handling if they type something not on the menu
          aReturn.push(
            "What item would you like to order? \n 1. Snow Shovel \n 2. Broom \n 3.Garbage Bin"
          );
          this.stateCur = OrderState.ITEM1;
          break;
        }
        break;
      case OrderState.ITEM2GREETING:
        if (sInput.toLowerCase() == "yes") {
          //confirming second item
          this.stateCur = OrderState.ITEM2; //if they would like to add a second item, we switch to this case
          aReturn.push(
            "What second item would you like to order?  \n 1. Snow Shovel \n 2. Broom \n 3.Garbage Bin"
          );
        } else if (sInput.toLowerCase() == "no") {
          this.stateCur = OrderState.ICEMELT; //if no, we go straight to upsell
          aReturn.push(
            "Would you like a bag of ice melt (salt for snow removal) with that for $5? \n 1. YES \n 3. NO"
          ); //first up-sell item
        } else {
          aReturn.push("Please enter YES or NO");
          this.stateCur = OrderState.ITEM2GREETING;
        }
        break;
      case OrderState.ITEM2:
        if (sInput.toLowerCase() == "snow shovel") {
          this.item2 = sInput; //only saving item input if its valid
          this.stateCur = OrderState.ICEMELT;
          aReturn.push(
            "Would you like a bag of ice melt (salt for snow removal) with that for $5? \n 1. YES \n 3. NO"
          );
        } else if (sInput.toLowerCase() == "broom") {
          this.item2 = sInput;
          this.stateCur = OrderState.ICEMELT;
          aReturn.push(
            "Would you like a bag of ice melt (salt for snow removal) with that for $5? \n 1. YES \n 3. NO"
          );
        } else if (sInput.toLowerCase() == "garbage bin") {
          this.item2 = sInput;
          this.stateCur = OrderState.ICEMELT;
          aReturn.push(
            "Would you like a bag of ice melt (salt for snow removal) with that for $5? \n 1. YES \n 3. NO"
          );
        } else {
          aReturn.push("Please enter a valid menu item"); //error handling if they type something not available for purchase
          aReturn.push(
            "What second item would you like to order?  \n 1. Snow Shovel \n 2. Broom \n 3.Garbage Bin"
          );
          this.stateCur = OrderState.ITEM2;
          break;
        }
        break;
      case OrderState.ICEMELT:
        if (sInput.toLowerCase() != "no" && sInput.toLowerCase() != "yes") {
          aReturn.push("Please enter either YES or NO"); //basic up-sell item
          this.stateCur = OrderState.ICEMELT;
        } else if (sInput.toLowerCase() == "yes") {
          this.iceMelt = sInput;
          aReturn.push(
            "Would you like to add on a propane cylinder to your order for $15? \n 1. YES \n 2. NO"
          ); //basic up-sell item
          this.stateCur = OrderState.PROPANE;
        }
        if (sInput.toLowerCase() == "no") {
          aReturn.push(
            "Would you like to add on a propane cylinder to your order for $15? \n 1. YES \n 2. NO"
          ); //basic up-sell item
          this.stateCur = OrderState.PROPANE;
        }
        break;
      case OrderState.PROPANE:
        if (sInput.toLowerCase() != "no" && sInput.toLowerCase() != "yes") {
          aReturn.push(`${sInput} is not valid. Select either YES or NO`); //basic up-sell item
          this.stateCur = OrderState.PROPANE;
        } else {
          if (sInput.toLowerCase() != "no") {
            this.propane = sInput;
          }
          //calculating order total
          let preTaxTotal = 0;
          let snowShovelCost = 19.99;
          let broomCost = 33.0;
          let garbageBinCost = 29.0;
          let iceMeltCost = 5.0;
          let propaneCost = 15.0;

          if (this.iceMelt) {
            //if ice melt was ordered, adding to the cost
            preTaxTotal += iceMeltCost;
          }
          if (this.propane) {
            //if propane was ordered, adding to the cost
            preTaxTotal += propaneCost;
          }
          if (this.item1.toLowerCase() == "snow shovel") {
            //Calculating cost based on item ordered
            preTaxTotal += snowShovelCost;
          }
          if (this.item1.toLowerCase() == "broom") {
            preTaxTotal += broomCost;
          }
          if (this.item1.toLowerCase() == "garbage bin") {
            preTaxTotal += garbageBinCost;
          }
          if (this.item2.toLowerCase() == "snow shovel") {
            //calculating cost based on second item ordered
            preTaxTotal += snowShovelCost;
          }
          if (this.item2.toLowerCase() == "broom") {
            preTaxTotal += broomCost;
          }
          if (this.item2.toLowerCase() == "garbage bin") {
            preTaxTotal += garbageBinCost;
          }

          let tax = 0.13;
          this.total = tax * preTaxTotal + preTaxTotal; //total of items with tax included

          aReturn.push("Thank-you for your order of");
          aReturn.push(`${this.item1}`);
          if (this.item2) {
            //only displaying if a second item was added
            aReturn.push(`${this.item2}`);
          }
          if (this.propane) {
            aReturn.push(`Propane Cylinder`);
          }
          if (this.iceMelt) {
            aReturn.push(`With a bag of ice melt`);
          }
          let d = new Date();
          d.setMinutes(d.getMinutes() + 20);
          aReturn.push(
            `Your total is $${this.total.toFixed(
              2
            )}. Your order will be ready at approximately ${d.toTimeString()}. We will text you when we are ready to meet you @ curbside.`
          );
          this.isDone(true);
          break;
        }
    }
    return aReturn;
  }
  renderForm() {
    // your client id should be kept private
    return `
     <html>
      <head>
          <meta content="text/html; charset=UTF-8" http-equiv="content-type">
          <style type="text/css">
              ol {
                  margin: 0;
                  padding: 0
              }
      
              table td,
              table th {
                  padding: 0
              }
      
              .c1 {
                  border-right-style: solid;
                  padding: 5pt 5pt 5pt 5pt;
                  border-bottom-color: #000000;
                  border-top-width: 1pt;
                  border-right-width: 1pt;
                  border-left-color: #000000;
                  vertical-align: top;
                  border-right-color: #000000;
                  border-left-width: 1pt;
                  border-top-style: solid;
                  border-left-style: solid;
                  border-bottom-width: 1pt;
                  width: 234pt;
                  border-top-color: #000000;
                  border-bottom-style: solid
              }
      
              .c13 {
                  color: #000000;
                  font-weight: 400;
                  text-decoration: none;
                  vertical-align: baseline;
                  font-size: 36pt;
                  font-family: "Arial";
                  font-style: normal
              }
      
              .c0 {
                  color: #000000;
                  font-weight: 400;
                  text-decoration: none;
                  vertical-align: baseline;
                  font-size: 26pt;
                  font-family: "Arial";
                  font-style: normal
              }
      
              .c2 {
                  color: #000000;
                  font-weight: 400;
                  text-decoration: none;
                  vertical-align: baseline;
                  font-size: 11pt;
                  font-family: "Arial";
                  font-style: normal
              }
      
              .c9 {
                  padding-top: 12pt;
                  padding-bottom: 0pt;
                  line-height: 1.0;
                  orphans: 2;
                  widows: 2;
                  text-align: left;
                  height: 11pt
              }
      
              .c12 {
                  padding-top: 12pt;
                  padding-bottom: 0pt;
                  line-height: 1.0;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c3 {
                  padding-top: 0pt;
                  padding-bottom: 0pt;
                  line-height: 1.15;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c10 {
                  padding-top: 0pt;
                  padding-bottom: 0pt;
                  line-height: 1.0;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c4 {
                  padding-top: 0pt;
                  padding-bottom: 7pt;
                  line-height: 1.15;
                  orphans: 2;
                  widows: 2;
                  text-align: right
              }
      
              .c8 {
                  padding-top: 0pt;
                  padding-bottom: 7pt;
                  line-height: 1.15;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c11 {
                  border-spacing: 0;
                  border-collapse: collapse;
                  margin-right: auto
              }
      
              .c5 {
                  background-color: #ffffff;
                  max-width: 468pt;
                  padding: 72pt 72pt 72pt 72pt
              }
      
              .c6 {
                  height: 48.2pt
              }
      
              .c7 {
                  height: 52pt
              }
      
              .c15 {
                  font-size: 26pt
              }
      
              .c14 {
                  height: 11pt
              }
      
              .title {
                  padding-top: 0pt;
                  color: #000000;
                  font-size: 26pt;
                  padding-bottom: 3pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .subtitle {
                  padding-top: 0pt;
                  color: #666666;
                  font-size: 15pt;
                  padding-bottom: 16pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              li {
                  color: #000000;
                  font-size: 11pt;
                  font-family: "Arial"
              }
      
              p {
                  margin: 0;
                  color: #000000;
                  font-size: 11pt;
                  font-family: "Arial"
              }
      
              h1 {
                  padding-top: 20pt;
                  color: #000000;
                  font-size: 20pt;
                  padding-bottom: 6pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h2 {
                  padding-top: 18pt;
                  color: #000000;
                  font-size: 16pt;
                  padding-bottom: 6pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h3 {
                  padding-top: 16pt;
                  color: #434343;
                  font-size: 14pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h4 {
                  padding-top: 14pt;
                  color: #666666;
                  font-size: 12pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h5 {
                  padding-top: 12pt;
                  color: #666666;
                  font-size: 11pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h6 {
                  padding-top: 12pt;
                  color: #666666;
                  font-size: 11pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  font-style: italic;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
          </style>
      </head>
      
      <body class="c5">
          <p class="c3"><span
                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </p>
          <p class="c10"><span class="c0">Welcome to Home Hardware Curbside Ordering</span></p>
          <p class="c10"><span class="c0">For curbside pickup:</span></p>
          <p class="c12"><span class="c15">Text 519-111-1111</span></p>
          <p class="c9"><span class="c2"></span></p><a id="t.d97173251f8e8de98f4d2ef9884eaa81e39c959c"></a><a id="t.0"></a>
          <table class="c11">
              <tbody>
                  <tr class="c7">
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c8"><span class="c0">Snow Shovel</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c4">
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                                  class="c0">$19.99</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                  </tr>
                  <tr class="c6">
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c8"><span class="c0">Heavy-Duty Broom</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c4">
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                                  class="c0">$33.00</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                  </tr>
                  <tr class="c6">
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c8"><span class="c0">Garbage Bin</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c4">
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                                  class="c0">$29.00</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                  </tr>
                    <tr class="c6">
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c8"><span class="c0">Ice Melt - Salt Bag</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c4">
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                                  class="c0">$5.00</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                  </tr>
                    <tr class="c6">
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c8"><span class="c0">Propane Cylinder</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c4">
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                                  class="c0">$15.00</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                  </tr>
              </tbody>
          </table>
          <p class="c9"><span class="c2"></span></p>
          <p class="c12"><span class="c0">Thank you for choosing Home Hardware!</span></p>
          <p class="c3 c14"><span class="c2"></span></p>
      </body>
      
      </html>      `;
  }
};
