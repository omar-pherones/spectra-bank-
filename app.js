'use strict';
const accounts = [
    {
        owner: 'Omar Faruk',
        movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
        interestRate: 1.5, // %
        password: 1234,
        movementsDates: [
            '2021-11-18T21:31:17.178Z',
            '2021-12-23T07:42:02.383Z',
            '2022-01-28T09:15:04.904Z',
            '2022-04-01T10:17:24.185Z',
            '2022-07-08T14:11:59.604Z',
            '2022-09-10T17:01:17.194Z',
            '2022-09-12T23:36:17.929Z',
            '2022-09-15T12:51:31.398Z',
            '2022-09-19T06:41:26.190Z',
            '2022-09-21T08:11:36.678Z',
        ],
        currency: 'USD',
        locale: 'en-US',
    },
    {
        owner: 'Sunerah Binte Ayesha',
        movements: [
            5000, 3400, -150, -790, -3210, -1000, 8500, -300, 1500, -1850,
        ],
        interestRate: 1.3, // %
        password: 5678,
        movementsDates: [
            '2021-12-11T21:31:17.671Z',
            '2021-12-27T07:42:02.184Z',
            '2022-01-05T09:15:04.805Z',
            '2022-02-14T10:17:24.687Z',
            '2022-03-12T14:11:59.203Z',
            '2022-05-16T17:01:17.392Z',
            '2022-08-10T23:36:17.522Z',
            '2022-09-03T12:51:31.491Z',
            '2022-09-18T06:41:26.394Z',
            '2022-09-21T08:11:36.276Z',
        ],
        currency: 'EUR',
        locale: 'en-GB',
    },
];

// ------------------------------------------------------------------------------------------------------------
// All  Elements selectore--------------------------------------------------------------------------------------

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance-value');
const labelSumIn = document.querySelector('.summary-value-in');
const labelSumOut = document.querySelector('.summary-value-out');
const labelSumInterest = document.querySelector('.summary-value-interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login-btn');
const btnTransfer = document.querySelector('.form-btn-transfer');
const btnLoan = document.querySelector('.form-btn-loan');
const btnClose = document.querySelector('.form-btn-close');
const btnSort = document.querySelector('.btn-sort');
const inputLoginUsername = document.querySelector('.login-input-username');
const inputLoginPassword = document.querySelector('.login-input-password');
const inputTransferTo = document.querySelector('.form-input-to');
const inputTransferAmount = document.querySelector('.form-input-amount');
const inputLoanAmount = document.querySelector('.form-input-loan-amount');
const inputCloseUsername = document.querySelector('.form-input-username');
const inputClosePassword = document.querySelector('.form-input-password');

let currentAccount, timer;

// ----------------------------------------------------------------------------------------------------------
// Display Movements show --------------------------------------------------------------------------------------

function displayMovements(account, sort = false) {
    containerMovements.innerHTML = '';
    const moves = sort
        ? account.movements.slice(0).sort((a, b) => a - b)
        : account.movements;
    // console.log(moves);
    moves.forEach((move, i) => {
        const currency = creatCurrency(move, account.locale, account.currency);
        const type = move > 0 ? 'deposit' : 'withdrawal';
        const date = new Date(account.movementsDates[i]);
        // const locale = account.locale;
        const displayDate = formatMovementDate(date, account.locale);
        const html = `
        <div class="movements-row">
        <div class="movements-type movements-type-${type}">
            ${i + 1} ${type}
        </div>
        <div class="movements-date">${displayDate}</div>
        <div class="movements-value">${currency}</div>
    </div>
    `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}

// ----------------------------------------------------------------------------------------------------------
// Display Summary show --------------------------------------------------------------------------------------

function displaySummary(account) {
    // console.log(account);
    // income Summary show
    labelSumIn.textContent = '';
    const income = account.movements
        .filter((move) => move > 0)
        .reduce((acc, income) => acc + income);
    labelSumIn.textContent = `${income}$`;
    // Outcome summary show
    labelSumOut.textContent = '';
    const outcome = account.movements
        .filter((move) => move < 0)
        .reduce((acc, outcome) => acc + outcome);
    labelSumOut.textContent = `${Math.abs(outcome)}$`;
    // Interest Summary show
    labelSumInterest.textContent = '';
    const interest = account.movements
        .filter((move) => move > 0)
        .map((move) => (move * account.interestRate) / 100)
        .filter((deposit) => deposit > 0)
        .reduce((acc, interest) => acc + interest);
    labelSumInterest.textContent = `${interest}$`;
}

// ----------------------------------------------------------------------------------------------------------
// Display Balance show --------------------------------------------------------------------------------------
function displayBalance(account) {
    // console.log(account);
    labelBalance.textContent = '';
    account.balance = account.movements.reduce((acc, move) => acc + move);
    labelBalance.textContent = `${creatCurrency(
        account.balance,
        account.locale,
        account.currency
    )}`;
}

// ----------------------------------------------------------------------------------------------------------
// UserNmae Create --------------------------------------------------------------------------------------

function createUsernames(accounts) {
    accounts.forEach((account) => {
        account.userName = account.owner
            .toLowerCase()
            .split(' ')
            .map((word) => word[0])
            .join('');
    });
}
createUsernames(accounts);
// ----------------------------------------------------------------------------------------------------------
// Implementing Loging  --------------------------------------------------------------------------------------

btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    currentAccount = accounts.find(
        (account) => account?.userName === inputLoginUsername.value
    );

    if (
        currentAccount?.password === Number(inputLoginPassword.value) &&
        currentAccount?.userName === inputLoginUsername.value
    ) {
        labelWelcome.textContent = `Welcome Back, ${currentAccount.owner
            .split(' ')
            .at(0)}`;
        containerApp.style.opacity = 1;
        labelWelcome.style.color = '#444';
        // Create current date and time
        const now = new Date();
        const option = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        };
        // display UI
        const currentDate = new Intl.DateTimeFormat(
            currentAccount.locale,
            option
        ).format(now);
        labelDate.textContent = currentDate;
        // LOgOut Account
        if (timer) clearInterval(timer);
        timer = Logout();
        displayUI(currentAccount);
    } else {
        labelWelcome.textContent = 'Incorrect user or password!';
        labelWelcome.style.color = '#f3442a';
        containerApp.style.opacity = 0;
        // LOgOut Account
        if (timer) clearInterval(timer);
        timer = Logout();
    }
    // clear Input filde
    inputLoginUsername.value = inputLoginPassword.value = '';
    inputLoginUsername.blur();
    inputLoginPassword.blur();
});

// ----------------------------------------------------------------------------------------------------------
// Display UI Update  --------------------------------------------------------------------------------------
function displayUI(account) {
    displayBalance(account);
    displayMovements(account);
    displaySummary(account);
}

// ----------------------------------------------------------------------------------------------------------
// Implementing Currency  --------------------------------------------------------------------------------------

function creatCurrency(value, locale, currency) {
    // console.log(value, locale, currency);
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
}

// ----------------------------------------------------------------------------------------------------------
// Implementing Transition  --------------------------------------------------------------------------------------

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    // console.log(currentAccount.userName)
    let receverAccount = accounts.find(
        (account) => account.userName === inputTransferTo.value
    );
    // console.log(receverAccount);
    let amount = Number(inputTransferAmount.value);
    if (
        receverAccount !== currentAccount?.userName &&
        currentAccount.userName !== inputTransferTo.value &&
        amount <= currentAccount.balance &&
        amount > 0 &&
        receverAccount
    ) {
        // currentAccount.movements.push(-amount)
        currentAccount.movements.push(-amount);
        receverAccount.movements.push(amount);
        // Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receverAccount.movementsDates.push(new Date().toISOString());
        // Display success message
        labelWelcome.textContent = 'Transfer successful!';
        labelWelcome.style.color = '#00b79f';
        // LOgOut Account
        if (timer) clearInterval(timer);
        timer = Logout();
        displayUI(currentAccount);
    } else {
        // Display warning message
        labelWelcome.textContent = 'Invalid transfer!';
        labelWelcome.style.color = '#f3442a';
        // LOgOut Account
        if (timer) clearInterval(timer);
        timer = Logout();
    }
    // cleat Input filde
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();
    // console.log(transferAccount);
});

// ----------------------------------------------------------------------------------------------------------
// Implementing Loan--------------------------------------------------------------------------------------

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    if (
        amount > 0 &&
        currentAccount.movements.some((move) => move >= amount * 0.1)
    ) {
        // Add movement
        currentAccount.movements.push(amount);
        // Add Request loan date
        currentAccount.movementsDates.push(new Date().toISOString());
        // Display message
        labelWelcome.textContent = 'Loan request granted!';
        labelWelcome.style.color = '#00b79f';
        // LOgOut Account
        if (timer) clearInterval(timer);
        timer = Logout();
        // Update UI
        displayUI(currentAccount);
    } else {
        // Display warning message
        labelWelcome.textContent = 'Amount not granted!';
        labelWelcome.style.color = '#f3442a';
        // LOgOut Account
        if (timer) clearInterval(timer);
        timer = Logout();
    }
    // clear filder
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
});
// ----------------------------------------------------------------------------------------------------------
// Close Account  --------------------------------------------------------------------------------------

btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    // console.log(e);
    if (
        currentAccount.userName === inputCloseUsername.value &&
        currentAccount.password === Number(inputClosePassword.value)
    ) {
        //    Finder Account
        const findIndex = accounts.findIndex((account) => account);
        accounts.splice(findIndex, 1);
        // Hide UI and display warning message
        labelWelcome.textContent = 'Account deleted!';
        labelWelcome.style.color = '#00b79f';
        containerApp.style.opacity = 0;
        // LOgOut Account
        if (timer) clearInterval(timer);
        timer = Logout();
    } else {
        // Display Massange
        labelWelcome.textContent = 'Action failed!';
        labelWelcome.style.color = '#f3442a';
        // LOgOut Account
        if (timer) clearInterval(timer);
        timer = Logout();
    }

    // clear filde
    inputCloseUsername.value = inputClosePassword.value = '';
    inputCloseUsername.blur();
    inputClosePassword.blur();
});

// -----------------------------------------------------------------------------------------------------------------
// Implementing Sorting Moement --------------------------------------------------------------------------------------
let sortMove = true;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount, sortMove);
    sortMove = !sortMove;
});
// -----------------------------------------------------------------------------------------------------------------
// Implementing Days calculation  --------------------------------------------------------------------------------------

function formatMovementDate(date, locale) {
    const calcDaysPassed = (date1, date2) => {
        return Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));
    };
    const daysPasssed = calcDaysPassed(new Date(), date);
    if (daysPasssed === 0) return 'Today';
    if (daysPasssed === 1) return 'Yesterday';
    if (daysPasssed <= 7) return `${daysPasssed} days ago`;
    const option = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    return new Intl.DateTimeFormat(locale, option).format(date);
}

// -----------------------------------------------------------------------------------------------------------------
// Implementing Logout Timer --------------------------------------------------------------------------------------

function Logout() {
    labelTimer.textContent = '';
    let time = 120;
    const tickTick = () => {
        const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
        const second = String(time % 60).padStart(2, 0);
        // console.log(minutes);
        // console.log(second);
        labelTimer.textContent = `${minutes}:${second}`;
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = 'You have been logged out!';
            labelWelcome.style.color = '#f3442a';
            containerApp.style.opacity = 0;
        }
        time--;
    };
    tickTick();
    timer = setInterval(tickTick, 1000);
    return timer;
}
