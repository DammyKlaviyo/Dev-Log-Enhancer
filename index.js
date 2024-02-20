window.addEventListener("load", function() {
  applyRowNumbers();
  applyActiveRow();
  
  // Main Table Mutation Observer
  const targetNode = document.querySelector('.BasicLayout-body-inner tbody');
  const mutationCallback = (mutationsList, observer) => {
    applyRowNumbers();
    applyActiveRow();
  };

  const observer = new MutationObserver(mutationCallback);
  const config = {
    childList: true,
    subtree: false,
    attributes: false
  };
  observer.observe(targetNode, config);

  // API Call Details Block Mutation Observer
  const targetNodeTwo = document.querySelector('.DrawerPanelBody-content');
  const mutationCallbackTwo = (mutationsList, observer) => {
    if (mutationsList[0].type == 'childList') {
      // if Details block is open, apply 'prev' & 'next' buttons
      if (document.querySelector('.DrawerPanelBody-content').childElementCount > 0) {
        applyPrevNextButtons();
      }
    }
  };

  const observerTwo = new MutationObserver(mutationCallbackTwo);
  const configTwo = {
    childList: true,
    subtree: true,
    attributes: true
  };
  observerTwo.observe(targetNodeTwo, configTwo);
});

function applyRowNumbers() {
  document.querySelectorAll('.row-number-head').forEach(element => element.remove());
  document.querySelectorAll('.row-number').forEach(element => element.remove());

  // Apply table header title
  if (!document.querySelector('.row-number-head') && document.querySelectorAll('.BasicLayout-body-inner tbody tr td div').length > 1) {
    let columnTitle = document.createElement('th');
    columnTitle.classList.add('row-number-head');
    let tableHeader = document.querySelector('.BasicLayout-body-inner thead tr');
    tableHeader.insertBefore(columnTitle, tableHeader.firstChild);
    columnTitle.textContent = "Row num";
  }

  // Apply row numbers
  if (!document.querySelector('.row-number') && document.querySelectorAll('.BasicLayout-body-inner tbody tr td div').length > 1) {
    let tableRows = document.querySelectorAll('.BasicLayout-body-inner tbody tr');
    tableRows.forEach((trEl, index) => {
      let newTd = document.createElement('td');
      newTd.classList.add('row-number');
      newTd.textContent = index + 1;
      trEl.insertBefore(newTd, trEl.firstChild);
    });
  }
}

function applyActiveRow() {
  if (!document.querySelector('.kl-active')) {
    let tableRows = document.querySelectorAll('.BasicLayout-body-inner tbody tr');
    tableRows.forEach((trEl, index) => {
      if (!trEl.classList.contains('kl-row') && trEl.querySelector('td button')) {
        trEl.classList.add('kl-row');
        trEl.querySelector('td button').addEventListener('click', () => {
          // remove active-row class from previous active row
          let prevActiveRow = document.querySelector('.kl-active');
          if (prevActiveRow) {
            prevActiveRow.style.backgroundColor = '';
            prevActiveRow.classList.remove('kl-active');
          }
          // apply active-row class to recently clicked el
          trEl.classList.add('kl-active')
          trEl.style.backgroundColor = '#F3F6F7';
          // remove active status from row when clicked
          let activeRow = document.querySelector('.kl-active')
          activeRow.addEventListener('mousedown', function() {
            if (document.querySelector('.DrawerPanelBody-content').childElementCount === 0) {
              activeRow.style.backgroundColor = '';
              activeRow.classList.remove('kl-active')
            }
          })
        });
      }
    });
  }
}

function applyPrevNextButtons() {
  let currentRow = document.querySelector('.kl-active');
  let previousRow = currentRow ? currentRow.previousElementSibling : null;
  let nextRow = currentRow ? currentRow.nextElementSibling : null;
  let detailsBlock = document.querySelector('.DrawerPanelBody-content');
  // create'Prev' button
  if (previousRow) {
    if (!document.querySelector('.prev-call-btn')) {
      let prevRowBtn = document.createElement('button');
      prevRowBtn.classList.add('btn', 'prev-call-btn');
      prevRowBtn.textContent = "Prev Call";
      detailsBlock.lastElementChild.appendChild(prevRowBtn)
      prevRowBtn.addEventListener('click', function() {
        document.querySelector('#ascent-portal-container button[title="Close"]').click()
        previousRow.querySelector('button').click();
      })
    }
  }
  // Create 'Next' button
  if (nextRow) {
    if (!document.querySelector('.next-call-btn')) {
      let nextRowBtn = document.createElement('button');
      nextRowBtn.classList.add('btn', 'next-call-btn');
      nextRowBtn.textContent = "Next Call";
      detailsBlock.lastElementChild.appendChild(nextRowBtn)
      nextRowBtn.addEventListener('click', function() {
        document.querySelector('#ascent-portal-container button[title="Close"]').click()
        nextRow.querySelector('button').click();
      })
    }
  }
}
