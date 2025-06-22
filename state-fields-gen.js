javascript: (function () {
  if (window.stateFields) {
    return;
  }

  window.stateFields = {
    snils,
    innFl,
    innUl,
    ogrn,
    kpp,
  };

  function snils() {
    const parts = [
      Math.floor(Math.random() * 998) + 2,
      Math.floor(Math.random() * 999) + 1,
      Math.floor(Math.random() * 999) + 1,
    ]
      .map((num) => num.toString().padStart(3, '0'))
      .join('');

    const totalSum = Array.from(parts).reduce(
      (sum, digit, index) => sum + parseInt(digit) * (9 - index),
      0
    );

    let controlNumber = totalSum % 101;
    if (controlNumber === 100) controlNumber = 0;

    return parts + controlNumber.toString().padStart(2, '0');
  }

  function innFl() {
    const region = String(Math.floor(Math.random() * 92 + 1)).padStart(2, '0');
    const inspection = String(Math.floor(Math.random() * 99 + 1)).padStart(
      2,
      '0'
    );
    const numberPart = String(Math.floor(Math.random() * 999999 + 1)).padStart(
      6,
      '0'
    );
    let inn = region + inspection + numberPart;

    const weights1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    const weights2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

    let sum = 0;
    for (let i = 0; i < weights1.length; i++) {
      sum += weights1[i] * parseInt(inn[i], 10);
    }
    inn += String((sum % 11) % 10);

    sum = 0;
    for (let i = 0; i < weights2.length; i++) {
      sum += weights2[i] * parseInt(inn[i], 10);
    }
    inn += String((sum % 11) % 10);

    return inn;
  }

  function innUl() {
    const region = String(Math.floor(Math.random() * 92 + 1)).padStart(2, '0');
    const inspection = String(Math.floor(Math.random() * 99 + 1)).padStart(
      2,
      '0'
    );
    const numba = String(Math.floor(Math.random() * 99999 + 1)).padStart(
      5,
      '0'
    );

    const first9 = region + inspection + numba;

    const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(first9[i]) * weights[i];
    }

    const kontr = (sum % 11) % 10 === 0 ? 0 : (sum % 11) % 10;

    return first9 + kontr;
  }

  function ogrn() {
    const priznak = Math.floor(Math.random() * 9) + 1;
    const godreg = Math.floor(Math.random() * 16) + 1;
    const region = Math.floor(Math.random() * 92) + 1;
    const inspection = Math.floor(Math.random() * 99) + 1;
    const zapis = Math.floor(Math.random() * 99999) + 1;

    const base = [
      priznak,
      godreg.toString().padStart(2, '0'),
      region.toString().padStart(2, '0'),
      inspection.toString().padStart(2, '0'),
      zapis.toString().padStart(5, '0'),
    ].join('');

    const num = parseInt(base);
    const remainder = num % 11;
    const kontr = remainder === 10 ? 0 : remainder;

    return base + kontr;
  }

  function kpp() {
    const region = String(Math.floor(Math.random() * 92 + 1)).padStart(2, '0');
    const inspection = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    const reason = ['01', '43', '44', '45'][Math.floor(Math.random() * 4)];
    const number = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

    return region + inspection + reason + number;
  }
})();
