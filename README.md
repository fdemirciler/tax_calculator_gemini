# Tax Calculator

> **Disclaimer**: This application was created as a practice project to improve JavaScript, HTML, and CSS skills. The tax brackets and rates used in this calculator are fictional and should **not** be used for actual tax calculations. They serve only as sample data to demonstrate the calculation logic and user interface design.

A simple, responsive, and efficient tax calculator built with vanilla JavaScript, HTML, and CSS.

This is a revised version of tax_app_windsurf repo based on Gemini 2.5 recommendations.
## Features

* **Real-time Calculation:** See tax estimations update instantly as you type.
* **Fictional Tax Brackets:** Uses a seven-tier progressive tax system (10% to 37%) for demonstration.
* **Clear Results:** Displays effective tax rate, total tax amount, and net income.
* **Currency Formatting:** Uses Euro (€) formatting for inputs and results.
* **Responsive Design:** Adapts to various screen sizes, from mobile to desktop.
* **Persistence:** Remembers the last entered income using browser local storage.
* **Accessibility:** Includes keyboard navigation support and ARIA attributes for screen reader users.
* **Lightweight:** Built with vanilla HTML, CSS, and JavaScript – no external libraries or frameworks needed.

## Fictional Tax Brackets Used

* 10%: €0 - €20,550
* 12%: €20,551 - €83,550
* 22%: €83,551 - €178,150
* 24%: €178,151 - €340,100
* 32%: €340,101 - €431,900
* 35%: €431,901 - €647,850
* 37%: Above €647,851

## How to Use

1.  Open the `index.html` file in your web browser.
2.  Enter your annual gross income in the input field.
3.  View the calculated effective tax rate, tax amount, and net income in the results section.
4.  Refer to the tax brackets table at the bottom for details on the fictional rates used.

## Technologies

* HTML5 (with ARIA for accessibility)
* CSS3 (using CSS Variables)
* Vanilla JavaScript (ES6+)