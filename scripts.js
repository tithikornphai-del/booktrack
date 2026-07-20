
const BOOKTRACK_API_URL='https://script.google.com/macros/s/AKfycbxopgCq_WpG20EFqppbpOi9Soea91IhWyEnwnqeFao8J8QWE2C5Bf13mQSyoXuibvyJLg/exec';
window.__booktrackJsonp=window.__booktrackJsonp||{};
function booktrackApiRequest(action,payload){
  return new Promise((resolve,reject)=>{
    const n='cb_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    const s=document.createElement('script');
    let timer;
    const clean=()=>{clearTimeout(timer);delete window.__booktrackJsonp[n];s.remove();};
    window.__booktrackJsonp[n]=r=>{clean();r&&r.ok?resolve(r.data):reject(new Error(r?.error?.message||'API request failed.'));};
    const q=new URLSearchParams({api:'1',action,callback:'__booktrackJsonp.'+n,payload:JSON.stringify(payload||{})});
    s.src=BOOKTRACK_API_URL+'?'+q.toString();s.async=true;
    s.onerror=()=>{clean();reject(new Error('Cannot connect to BookTrack API.'));};
    timer=setTimeout(()=>{clean();reject(new Error('BookTrack API request timed out.'));},20000);
    document.head.appendChild(s);
  });
}
window.google=window.google||{};window.google.script=window.google.script||{};
function createRunner(ok,fail){
  return new Proxy({},{get(_t,p){
    if(p==='withSuccessHandler')return h=>createRunner(h,fail);
    if(p==='withFailureHandler')return h=>createRunner(ok,h);
    return (...a)=>booktrackApiRequest(String(p),a[0]).then(d=>ok&&ok(d)).catch(e=>fail?fail(e):console.error(e));
  }});
}
window.google.script.run=new Proxy({},{get(_t,p){
  if(p==='withSuccessHandler')return h=>createRunner(h,null);
  if(p==='withFailureHandler')return h=>createRunner(null,h);
  return (...a)=>booktrackApiRequest(String(p),a[0]);
}});

const state = {

  currentView: 'dashboard',

  isTransitioning: false,

  isSubmitting: false,

  isUpdating: false,

  isDeleting: false,

  moreDetailsOpen: false,

  books: [],

  selectedBook: null,

  draftCurrentPage: 0,

  filters: {
    search: '',
    status: 'All',
    genre: 'All'
  },

  music: {
    currentTrack: 0,
    isPlaying: false,
    collapsed: false,
    autoplayAttempted: false
  }

};


/* =========================================
   LANGUAGE + THEME
========================================= */

const translations = {

  en: {

    navDashboard: 'Dashboard',
    navLibrary: 'Library',
    navAddBook: 'Add Book',

    heroEyebrow: 'YOUR READING SPACE',
    heroTitle1: 'Every book leaves',
    heroTitle2: 'a trace.',

    heroDescription:
      'Track your books, follow your reading progress, and build a library that grows with you.',

    totalBooks: 'Total books',
    yourCollection: 'Your collection',

    currentlyReading: 'Currently reading',
    keepGoing: 'Keep going',

    completed: 'Completed',
    booksFinished: 'Books finished',

    wantToRead: 'Want to Read',
    readingList: 'Your reading list',

    reading: 'Reading',

    inProgress: 'IN PROGRESS',
    continueReading: 'Continue reading',
    viewLibrary: 'View library →',

    collection: 'COLLECTION',
    yourLibrary: 'Your Library',

    libraryDescription:
      "Everything you've saved, started and finished — all in one place.",

    searchPlaceholder:
      'Search books, authors or genres...',

    allStatus: 'All Status',
    allGenres: 'All Genres',
    clearFilters: 'Clear filters',

    newEntry: 'NEW ENTRY',
    addABook: 'Add a Book',

    addDescription:
      'Start with the essentials. Add more details only when you need them.',

    bookCover: 'Book Cover',

    coverHint:
      'Add a cover later if you want.',

    bookTitle: 'Book title',
    author: 'Author',
    totalPages: 'Total pages',
    status: 'Status',

    addMoreDetails: 'Add more details',
    hideMoreDetails: 'Hide more details',

    genre: 'Genre',
    coverUrl: 'Cover URL',
    rating: 'Rating',
    notRated: 'Not rated',
    notes: 'Notes',

    notesPlaceholder:
      'Write something about this book...',

    cancel: 'Cancel',
    addBookButton: 'Add Book',

    backToLibrary:
      '← Back to Library',

    deleteBook: 'Delete Book',

    removeBook:
      'Remove this book?',

    deleteWarning:
      'This action will permanently remove the book from your collection.',

    nowPlaying: 'NOW PLAYING',
    volume: 'VOLUME',

    readingProgress:
      'READING PROGRESS',

    saveChanges:
      'Save changes',

    startReading:
      'START READING',

    nextChapter:
      'Your next chapter starts here.',

    addBookJourney:
      'Add a book to begin tracking your reading journey.',

    currentlyReadingLabel:
      'CURRENTLY READING',

    progress:
      'Progress',

    continueReadingButton:
      'Continue reading',

    noBooks:
      'Your library is waiting.',

    addFirstBook:
      'Add your first book to begin.',

    noBooksFound:
      'No books found.',

    booksWord:
      'books',

    bookWord:
      'book',

    uncategorized:
      'Uncategorized',

    noRating:
      'Not rated',

    pages:
      'pages'

  },


  th: {

    navDashboard: 'หน้าหลัก',
    navLibrary: 'คลังหนังสือ',
    navAddBook: 'เพิ่มหนังสือ',

    heroEyebrow: 'พื้นที่การอ่านของคุณ',
    heroTitle1: 'ทุกเล่มที่อ่าน',
    heroTitle2: 'ทิ้งร่องรอยไว้เสมอ',

    heroDescription:
      'บันทึกหนังสือ ติดตามความคืบหน้าการอ่าน และสร้างคลังหนังสือที่เติบโตไปพร้อมกับคุณ',

    totalBooks: 'หนังสือทั้งหมด',
    yourCollection: 'คอลเลกชันของคุณ',

    currentlyReading: 'กำลังอ่าน',
    keepGoing: 'อ่านต่อไป',

    completed: 'อ่านจบแล้ว',
    booksFinished: 'หนังสือที่อ่านจบ',

    wantToRead: 'อยากอ่าน',
    readingList: 'รายการที่อยากอ่าน',

    reading: 'กำลังอ่าน',

    inProgress: 'กำลังดำเนินการ',
    continueReading: 'อ่านต่อ',
    viewLibrary: 'ดูคลังหนังสือ →',

    collection: 'คอลเลกชัน',
    yourLibrary: 'คลังหนังสือของคุณ',

    libraryDescription:
      'รวมหนังสือที่คุณบันทึก กำลังอ่าน และอ่านจบแล้วไว้ในที่เดียว',

    searchPlaceholder:
      'ค้นหาชื่อหนังสือ ผู้เขียน หรือประเภท...',

    allStatus: 'ทุกสถานะ',
    allGenres: 'ทุกประเภท',
    clearFilters: 'ล้างตัวกรอง',

    newEntry: 'เพิ่มรายการใหม่',
    addABook: 'เพิ่มหนังสือ',

    addDescription:
      'เริ่มจากข้อมูลที่จำเป็น และเพิ่มรายละเอียดเพิ่มเติมเมื่อคุณต้องการ',

    bookCover: 'ปกหนังสือ',

    coverHint:
      'คุณสามารถเพิ่มรูปปกภายหลังได้',

    bookTitle: 'ชื่อหนังสือ',
    author: 'ผู้เขียน',
    totalPages: 'จำนวนหน้าทั้งหมด',
    status: 'สถานะ',

    addMoreDetails: 'เพิ่มรายละเอียด',
    hideMoreDetails: 'ซ่อนรายละเอียด',

    genre: 'ประเภท',
    coverUrl: 'ลิงก์รูปปก',
    rating: 'คะแนน',
    notRated: 'ยังไม่ได้ให้คะแนน',
    notes: 'บันทึก',

    notesPlaceholder:
      'เขียนบันทึกเกี่ยวกับหนังสือเล่มนี้...',

    cancel: 'ยกเลิก',
    addBookButton: 'เพิ่มหนังสือ',

    backToLibrary:
      '← กลับไปคลังหนังสือ',

    deleteBook: 'ลบหนังสือ',

    removeBook:
      'ต้องการลบหนังสือเล่มนี้หรือไม่?',

    deleteWarning:
      'การดำเนินการนี้จะลบหนังสือออกจากคอลเลกชันอย่างถาวร',

    nowPlaying: 'กำลังเล่น',
    volume: 'ระดับเสียง',

    readingProgress:
      'ความคืบหน้าการอ่าน',

    saveChanges:
      'บันทึกการเปลี่ยนแปลง',

    startReading:
      'เริ่มอ่าน',

    nextChapter:
      'บทต่อไปของคุณเริ่มต้นที่นี่',

    addBookJourney:
      'เพิ่มหนังสือเพื่อเริ่มต้นติดตามเส้นทางการอ่านของคุณ',

    currentlyReadingLabel:
      'กำลังอ่านอยู่',

    progress:
      'ความคืบหน้า',

    continueReadingButton:
      'อ่านต่อ',

    noBooks:
      'คลังหนังสือของคุณยังว่างอยู่',

    addFirstBook:
      'เพิ่มหนังสือเล่มแรกเพื่อเริ่มต้น',

    noBooksFound:
      'ไม่พบหนังสือ',

    booksWord:
      'เล่ม',

    bookWord:
      'เล่ม',

    uncategorized:
      'ไม่ระบุประเภท',

    noRating:
      'ยังไม่ได้ให้คะแนน',

    pages:
      'หน้า'

  }

};


let currentLanguage =
  localStorage.getItem(
    'booktrack-language'
  ) || 'en';


let currentTheme =
  localStorage.getItem(
    'booktrack-theme'
  ) || 'dark';


function t(key) {

  return (
    translations[currentLanguage][key] ||
    translations.en[key] ||
    key
  );

}


function applyLanguage() {

  document.documentElement.lang =
    currentLanguage;


  document
    .querySelectorAll(
      '[data-i18n]'
    )
    .forEach(
      element => {

        const key =
          element.dataset.i18n;


        if (
          translations[currentLanguage][key]
        ) {

          element.textContent =
            translations[currentLanguage][key];

        }

      }
    );


  document
    .querySelectorAll(
      '[data-i18n-placeholder]'
    )
    .forEach(
      element => {

        const key =
          element.dataset.i18nPlaceholder;


        if (
          translations[currentLanguage][key]
        ) {

          element.placeholder =
            translations[currentLanguage][key];

        }

      }
    );


  const languageButton =
    document.getElementById(
      'languageToggle'
    );


  if (languageButton) {

    languageButton.textContent =

      currentLanguage === 'en'

        ? 'TH'

        : 'EN';

  }


  populateGenreFilter();

  renderLibrary();

  renderContinueReading();


  if (
    state.selectedBook &&
    state.currentView ===
    'bookDetail'
  ) {

    renderBookDetail(
      state.selectedBook
    );

  }

}


function toggleLanguage() {

  currentLanguage =

    currentLanguage === 'en'

      ? 'th'

      : 'en';


  localStorage.setItem(
    'booktrack-language',
    currentLanguage
  );


  applyLanguage();

}


function applyTheme() {

  document.documentElement.setAttribute(
    'data-theme',
    currentTheme
  );


  const button =
    document.getElementById(
      'themeToggle'
    );


  if (button) {

    button.textContent =

      currentTheme === 'dark'

        ? '☀'

        : '☾';

  }

}


function toggleTheme() {

  currentTheme =

    currentTheme === 'dark'

      ? 'light'

      : 'dark';


  localStorage.setItem(
    'booktrack-theme',
    currentTheme
  );


  applyTheme();

}


/* =========================================
   MUSIC TRACKS
========================================= */

const MUSIC_TRACKS = [

  {
    title:
      'Relax & Study',

    artist:
      'BOOKTRACK FOCUS',

    audioUrl:
      'https://res.cloudinary.com/g6hgsihr/video/upload/v1784477729/5_Minute_Timer_Lofi_do1hc5.mp3',

    coverUrl:
      'https://tithikornphai-del.github.io/lofi-music/c1.jpg'
  },

  {
    title:
      'Time Lofi Chill',

    artist:
      'BOOKTRACK FOCUS',

    audioUrl:
      'https://res.cloudinary.com/g6hgsihr/video/upload/v1784477730/5_minutes_-_Relax_study_with_me_Lofi_Mushie_in_a_forest_timer_1hour_5minute_lofi_study_ebwhnh.mp3',

    coverUrl:
      'https://tithikornphai-del.github.io/lofi-music/c2.jpg'
  },

  {
    title:
      'Chill Lofi Hip Hop',

    artist:
      'BOOKTRACK FOCUS',

    audioUrl:
      'https://res.cloudinary.com/g6hgsihr/video/upload/v1784477729/5_MINUTES_OF_No_Copyright_Music_CHILL_LOFI_HIP_HOP_BEAT_Royalty_free_ulzxh1.mp3',

    coverUrl:
      'https://tithikornphai-del.github.io/lofi-music/c3.jpg'
  }

];


let focusAudio = null;


/* =========================================
   NAVIGATION
========================================= */

function navigateTo(viewName) {

  if (
    state.isTransitioning ||
    state.currentView === viewName
  ) {
    return;
  }


  const currentView =
    document.querySelector(
      '.app-view.active'
    );


  const nextView =
    document.getElementById(
      `view-${viewName}`
    );


  if (!nextView) {
    return;
  }


  state.isTransitioning =
    true;


  if (currentView) {

    currentView.classList.add(
      'leaving'
    );

  }


  setTimeout(
    () => {

      if (currentView) {

        currentView.classList.remove(
          'active',
          'leaving'
        );

      }


      nextView.classList.add(
        'active'
      );


      state.currentView =
        viewName;


      updateNavigation(
        viewName
      );


      window.scrollTo(
        0,
        0
      );


      setTimeout(
        () => {

          state.isTransitioning =
            false;

        },
        500
      );

    },
    280
  );

}


function updateNavigation(viewName) {

  document
    .querySelectorAll(
      '.nav-link'
    )
    .forEach(
      link => {

        link.classList.toggle(

          'active',

          link.dataset.view ===
            viewName

        );

      }
    );

}


/* =========================================
   DATA
========================================= */

function loadBooks() {

  google.script.run

    .withSuccessHandler(
      handleBooksLoaded
    )

    .withFailureHandler(
      handleApiError
    )

    .getBooks();

}


function handleBooksLoaded(books) {

  state.books =
    Array.isArray(books)
      ? books
      : [];


  updateDashboardStats();

  populateGenreFilter();

  renderLibrary();

  renderContinueReading();

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboardStats() {

  setText(
    'statTotalBooks',
    state.books.length
  );


  setText(
    'statReading',
    state.books.filter(
      book =>
        book.Status === 'Reading'
    ).length
  );


  setText(
    'statCompleted',
    state.books.filter(
      book =>
        book.Status === 'Completed'
    ).length
  );


  setText(
    'statWantToRead',
    state.books.filter(
      book =>
        book.Status === 'Want to Read'
    ).length
  );

}


function renderContinueReading() {

  const container =
    document.getElementById(
      'continueReadingContent'
    );


  if (!container) {
    return;
  }


  const book =
    state.books.find(
      item =>
        item.Status === 'Reading'
    );


  if (!book) {

    container.innerHTML = `

      <div class="empty-feature-card">

        <div class="empty-orb"></div>

        <div>

          <span class="section-eyebrow">
            ${t('startReading')}
          </span>

          <h3>
            ${t('nextChapter')}
          </h3>

          <p>
            ${t('addBookJourney')}
          </p>

          <button
            class="primary-button"
            onclick="navigateTo('addBook')"
          >
            ${t('addBookButton')}
          </button>

        </div>

      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div class="empty-feature-card">

      <div>
        ${createCoverHTML(book)}
      </div>

      <div>

        <span class="section-eyebrow">
          ${t('currentlyReadingLabel')}
        </span>

        <h3>
          ${escapeHTML(
            book.Title
          )}
        </h3>

        <p>

          ${escapeHTML(
            book.Author
          )}

          ·

          ${book.CurrentPage}
          /
          ${book.TotalPages}
          ${t('pages')}

        </p>


        <div class="book-progress">

          <div class="book-progress-meta">

            <span>
              ${t('progress')}
            </span>

            <span>
              ${formatProgress(
                book.Progress
              )}%
            </span>

          </div>


          <div class="progress-track">

            <div
              class="progress-bar"
              style="
                width:
                ${formatProgress(
                  book.Progress
                )}%
              "
            ></div>

          </div>

        </div>


        <button
          class="primary-button"
          style="
            margin-top:
            28px;
          "
          onclick="
            openBookDetail(
              '${escapeAttribute(
                book.ID
              )}'
            )
          "
        >
          ${t('continueReadingButton')}
        </button>

      </div>

    </div>

  `;

}


/* =========================================
   LIBRARY
========================================= */

function renderLibrary() {

  const container =
    document.getElementById(
      'libraryContent'
    );


  if (!container) {
    return;
  }


  const books =
    getFilteredBooks();


  setText(

    'libraryResultCount',

    `${books.length} ${t(
      books.length === 1
        ? 'bookWord'
        : 'booksWord'
    )}`

  );


  updateClearFiltersButton();


  if (
    state.books.length === 0
  ) {

    container.innerHTML = `

      <div class="library-empty-state">

        <h2>
          ${t('noBooks')}
        </h2>

        <p>
          ${t('addFirstBook')}
        </p>

        <button
          class="primary-button"
          onclick="navigateTo('addBook')"
        >
          ${t('addBookButton')}
        </button>

      </div>

    `;

    return;

  }


  if (
    books.length === 0
  ) {

    container.innerHTML = `

      <div class="library-empty-state">

        <h2>
          ${t('noBooksFound')}
        </h2>

        <button
          class="secondary-button"
          onclick="clearLibraryFilters()"
        >
          ${t('clearFilters')}
        </button>

      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div class="library-grid">

      ${books
        .map(
          createBookCard
        )
        .join('')}

    </div>

  `;

}


function createBookCard(book) {

  return `

    <article
      class="book-card"
      onclick="
        openBookDetail(
          '${escapeAttribute(
            book.ID
          )}'
        )
      "
    >

      <div class="book-card-cover">

        ${createCoverHTML(book)}

        <span class="book-status-badge">

          ${translateBookStatus(
            book.Status
          )}

        </span>

      </div>


      <div class="book-card-content">

        <span class="book-card-genre">

          ${escapeHTML(
            book.Genre ||
            t('uncategorized')
          )}

        </span>


        <h3 class="book-card-title">

          ${escapeHTML(
            book.Title
          )}

        </h3>


        <p class="book-card-author">

          ${escapeHTML(
            book.Author
          )}

        </p>


        <div class="book-progress">

          <div class="book-progress-meta">

            <span>
              ${book.CurrentPage}
              /
              ${book.TotalPages}
            </span>

            <span>
              ${formatProgress(
                book.Progress
              )}%
            </span>

          </div>


          <div class="progress-track">

            <div
              class="progress-bar"
              style="
                width:
                ${formatProgress(
                  book.Progress
                )}%
              "
            ></div>

          </div>

        </div>


        <div class="book-card-footer">

          <span>

            ${
              Number(
                book.Rating
              ) > 0

                ? `★ ${book.Rating}/5`

                : t('noRating')
            }

          </span>

          <span>

            ${escapeHTML(
              book.DateAdded ||
              ''
            )}

          </span>

        </div>

      </div>

    </article>

  `;

}


function translateBookStatus(status) {

  if (
    status === 'Reading'
  ) {
    return t('reading');
  }


  if (
    status === 'Completed'
  ) {
    return t('completed');
  }


  if (
    status === 'Want to Read'
  ) {
    return t('wantToRead');
  }


  return status;

}


function getFilteredBooks() {

  const search =
    state.filters.search
      .toLowerCase()
      .trim();


  return state.books.filter(
    book => {

      const text =
        `${book.Title}
         ${book.Author}
         ${book.Genre}`
          .toLowerCase();


      return (

        (
          !search ||
          text.includes(search)
        )

        &&

        (
          state.filters.status === 'All'
          ||
          book.Status ===
            state.filters.status
        )

        &&

        (
          state.filters.genre === 'All'
          ||
          book.Genre ===
            state.filters.genre
        )

      );

    }
  );

}


function populateGenreFilter() {

  const select =
    document.getElementById(
      'genreFilter'
    );


  if (!select) {
    return;
  }


  const current =
    state.filters.genre;


  const genres = [

    ...new Set(

      state.books

        .map(
          book =>
            String(
              book.Genre || ''
            ).trim()
        )

        .filter(Boolean)

    )

  ];


  select.innerHTML = `

    <option value="All">
      ${t('allGenres')}
    </option>

  `;


  genres.forEach(
    genre => {

      const option =
        document.createElement(
          'option'
        );


      option.value =
        genre;


      option.textContent =
        genre;


      select.appendChild(
        option
      );

    }
  );


  if (
    genres.includes(current)
  ) {

    select.value =
      current;

  } else {

    select.value =
      'All';

  }

}


function clearLibraryFilters() {

  state.filters = {
    search: '',
    status: 'All',
    genre: 'All'
  };


  setInputValue(
    'librarySearch',
    ''
  );


  setInputValue(
    'statusFilter',
    'All'
  );


  setInputValue(
    'genreFilter',
    'All'
  );


  renderLibrary();

}


function updateClearFiltersButton() {

  const button =
    document.getElementById(
      'clearFiltersButton'
    );


  if (!button) {
    return;
  }


  const active =
    state.filters.search ||
    state.filters.status !== 'All' ||
    state.filters.genre !== 'All';


  button.classList.toggle(
    'visible',
    Boolean(active)
  );

}


/* =========================================
   BOOK DETAIL
========================================= */

function openBookDetail(id) {

  const book =
    state.books.find(
      item =>
        String(item.ID) ===
        String(id)
    );


  if (!book) {

    showToast(
      'Book not found.'
    );

    return;

  }


  state.selectedBook =
    book;


  state.draftCurrentPage =
    Number(
      book.CurrentPage
    );


  renderBookDetail(
    book
  );


  navigateTo(
    'bookDetail'
  );

}


function renderBookDetail(book) {

  const container =
    document.getElementById(
      'bookDetailContent'
    );


  if (!container) {
    return;
  }


  const progress =
    calculateClientProgress(
      state.draftCurrentPage,
      book.TotalPages
    );


  container.innerHTML = `

    <div class="detail-cover-wrap">

      <div class="detail-cover">
        ${createCoverHTML(book)}
      </div>

    </div>


    <div>

      <span class="detail-status">

        ${translateBookStatus(
          book.Status
        )}

      </span>


      <h1 class="detail-title">

        ${escapeHTML(
          book.Title
        )}

      </h1>


      <p class="detail-author">

        ${escapeHTML(
          book.Author
        )}

      </p>


      <div class="progress-controller">

        <div class="progress-controller-header">

          <div>

            <span class="section-eyebrow">
              ${t('readingProgress')}
            </span>

            <div
              id="progressPageDisplay"
              class="progress-page-number"
            >

              ${state.draftCurrentPage}
              /
              ${book.TotalPages}

            </div>

          </div>


          <div
            id="progressPercentDisplay"
            class="progress-percent-live"
          >

            ${progress}%

          </div>

        </div>


        <input
          id="progressSlider"
          class="progress-slider"
          type="range"
          min="0"
          max="${book.TotalPages}"
          value="${state.draftCurrentPage}"
          oninput="
            setProgressPage(
              Number(
                this.value
              )
            )
          "
        >


        <div class="progress-step-controls">

          <button
            class="progress-step-button"
            onclick="adjustProgress(-10)"
          >
            −10
          </button>

          <button
            class="progress-step-button"
            onclick="adjustProgress(-1)"
          >
            −1
          </button>

          <button
            class="progress-step-button"
            onclick="adjustProgress(1)"
          >
            +1
          </button>

          <button
            class="progress-step-button"
            onclick="adjustProgress(10)"
          >
            +10
          </button>

        </div>

      </div>


      <div class="detail-editor">

        <div class="form-group">

          <label>
            ${t('status')}
          </label>

          <select id="detailStatus">

            ${[
              'Want to Read',
              'Reading',
              'Completed'
            ]
              .map(
                status => `

                  <option
                    value="${status}"
                    ${
                      book.Status === status
                        ? 'selected'
                        : ''
                    }
                  >

                    ${translateBookStatus(
                      status
                    )}

                  </option>

                `
              )
              .join('')}

          </select>

        </div>


        <div class="form-group">

          <label>
            ${t('rating')}
          </label>

          <select id="detailRating">

            ${[0,1,2,3,4,5]
              .map(
                rating => `

                  <option
                    value="${rating}"
                    ${
                      Number(
                        book.Rating
                      ) === rating
                        ? 'selected'
                        : ''
                    }
                  >

                    ${
                      rating === 0
                        ? t('notRated')
                        : `${rating} / 5`
                    }

                  </option>

                `
              )
              .join('')}

          </select>

        </div>


        <div class="form-group">

          <label>
            ${t('notes')}
          </label>

          <textarea
            id="detailNotes"
            rows="6"
          >${escapeHTML(
            book.Notes ||
            ''
          )}</textarea>

        </div>


        <div class="detail-actions">

          <button
            class="delete-link"
            onclick="openDeleteModal()"
          >
            ${t('deleteBook')}
          </button>


          <button
            id="saveBookButton"
            class="primary-button"
            onclick="saveBookUpdate()"
          >
            ${t('saveChanges')}
          </button>

        </div>

      </div>

    </div>

  `;


  const status =
    document.getElementById(
      'detailStatus'
    );


  if (status) {

    status.addEventListener(
      'change',
      handleDetailStatusChange
    );

  }

}


function adjustProgress(amount) {

  setProgressPage(
    state.draftCurrentPage +
    amount
  );

}


function setProgressPage(page) {

  if (
    !state.selectedBook
  ) {
    return;
  }


  const total =
    Number(
      state.selectedBook.TotalPages
    );


  state.draftCurrentPage =
    Math.max(
      0,
      Math.min(
        total,
        Number(page)
      )
    );


  setInputValue(
    'progressSlider',
    state.draftCurrentPage
  );


  setText(
    'progressPageDisplay',
    `${state.draftCurrentPage} / ${total}`
  );


  setText(
    'progressPercentDisplay',
    `${calculateClientProgress(
      state.draftCurrentPage,
      total
    )}%`
  );


  const status =
    document.getElementById(
      'detailStatus'
    );


  if (!status) {
    return;
  }


  if (
    state.draftCurrentPage === total
  ) {

    status.value =
      'Completed';

  } else if (
    state.draftCurrentPage > 0 &&
    status.value === 'Want to Read'
  ) {

    status.value =
      'Reading';

  }

}


function handleDetailStatusChange() {

  const value =
    document
      .getElementById(
        'detailStatus'
      )
      .value;


  if (
    value === 'Want to Read'
  ) {

    setProgressPage(0);

  }


  if (
    value === 'Completed'
  ) {

    setProgressPage(
      state.selectedBook.TotalPages
    );

  }

}


function saveBookUpdate() {

  if (
    state.isUpdating ||
    !state.selectedBook
  ) {
    return;
  }


  const updatedBook = {

    ...state.selectedBook,

    CurrentPage:
      state.draftCurrentPage,

    Status:
      document
        .getElementById(
          'detailStatus'
        )
        .value,

    Rating:
      Number(
        document
          .getElementById(
            'detailRating'
          )
          .value
      ),

    Notes:
      document
        .getElementById(
          'detailNotes'
        )
        .value
        .trim()

  };


  state.isUpdating =
    true;


  const button =
    document.getElementById(
      'saveBookButton'
    );


  if (button) {

    button.disabled =
      true;

    button.textContent =
      currentLanguage === 'th'
        ? 'กำลังบันทึก...'
        : 'Saving...';

  }


  google.script.run

    .withSuccessHandler(
      response => {

        state.isUpdating =
          false;


        showToast(
          response.message
        );


        google.script.run

          .withSuccessHandler(
            books => {

              handleBooksLoaded(
                books
              );


              const refreshed =
                books.find(
                  item =>
                    String(item.ID) ===
                    String(updatedBook.ID)
                );


              if (refreshed) {

                state.selectedBook =
                  refreshed;


                state.draftCurrentPage =
                  Number(
                    refreshed.CurrentPage
                  );


                renderBookDetail(
                  refreshed
                );

              }

            }
          )

          .withFailureHandler(
            handleApiError
          )

          .getBooks();

      }
    )

    .withFailureHandler(
      error => {

        state.isUpdating =
          false;


        if (button) {

          button.disabled =
            false;

          button.textContent =
            t('saveChanges');

        }


        handleApiError(
          error
        );

      }
    )

    .updateBook(
      updatedBook
    );

}


/* =========================================
   ADD BOOK
========================================= */

function handleAddBook(event) {

  event.preventDefault();


  if (
    state.isSubmitting
  ) {
    return;
  }


  const title =
    document
      .getElementById(
        'title'
      )
      .value
      .trim();


  const author =
    document
      .getElementById(
        'author'
      )
      .value
      .trim();


  const totalPages =
    Number(
      document
        .getElementById(
          'totalPages'
        )
        .value
    );


  const status =
    document
      .getElementById(
        'status'
      )
      .value;


  if (
    !title ||
    !author ||
    totalPages <= 0
  ) {

    showToast(
      currentLanguage === 'th'
        ? 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ'
        : 'Please complete the required fields.'
    );

    return;

  }


  const book = {

    Title:
      title,

    Author:
      author,

    Genre:
      document
        .getElementById(
          'genre'
        )
        .value
        .trim(),

    CoverURL:
      document
        .getElementById(
          'coverURL'
        )
        .value
        .trim(),

    TotalPages:
      totalPages,

    CurrentPage:
      status === 'Completed'
        ? totalPages
        : 0,

    Status:
      status,

    Rating:
      Number(
        document
          .getElementById(
            'rating'
          )
          .value || 0
      ),

    Notes:
      document
        .getElementById(
          'notes'
        )
        .value
        .trim()

  };


  state.isSubmitting =
    true;


  setText(

    'addBookSubmitText',

    currentLanguage === 'th'
      ? 'กำลังเพิ่ม...'
      : 'Adding Book...'

  );


  google.script.run

    .withSuccessHandler(
      response => {

        state.isSubmitting =
          false;


        showToast(
          response.message
        );


        document
          .getElementById(
            'addBookForm'
          )
          .reset();


        resetAddBookUI();


        setText(
          'addBookSubmitText',
          t('addBookButton')
        );


        google.script.run

          .withSuccessHandler(
            books => {

              handleBooksLoaded(
                books
              );


              setTimeout(
                () => {

                  navigateTo(
                    'library'
                  );

                },
                450
              );

            }
          )

          .withFailureHandler(
            handleApiError
          )

          .getBooks();

      }
    )

    .withFailureHandler(
      error => {

        state.isSubmitting =
          false;


        setText(
          'addBookSubmitText',
          t('addBookButton')
        );


        handleApiError(
          error
        );

      }
    )

    .addBook(
      book
    );

}


function toggleMoreDetails() {

  state.moreDetailsOpen =
    !state.moreDetailsOpen;


  const panel =
    document.getElementById(
      'moreDetailsPanel'
    );


  if (panel) {

    panel.classList.toggle(
      'open',
      state.moreDetailsOpen
    );

  }


  setText(

    'moreDetailsText',

    state.moreDetailsOpen
      ? t('hideMoreDetails')
      : t('addMoreDetails')

  );


  setText(

    'moreDetailsIcon',

    state.moreDetailsOpen
      ? '−'
      : '+'

  );

}


function resetAddBookUI() {

  state.moreDetailsOpen =
    false;


  const panel =
    document.getElementById(
      'moreDetailsPanel'
    );


  if (panel) {

    panel.classList.remove(
      'open'
    );

  }


  setText(
    'moreDetailsText',
    t('addMoreDetails')
  );


  setText(
    'moreDetailsIcon',
    '+'
  );


  const preview =
    document.getElementById(
      'coverPreview'
    );


  if (preview) {

    preview.innerHTML =
      `<span>${t('bookCover')}</span>`;

  }

}


function updateCoverPreview() {

  const input =
    document.getElementById(
      'coverURL'
    );


  const preview =
    document.getElementById(
      'coverPreview'
    );


  if (
    !input ||
    !preview
  ) {
    return;
  }


  const url =
    input.value.trim();


  if (!url) {

    preview.innerHTML =
      `<span>${t('bookCover')}</span>`;

    return;

  }


  preview.innerHTML = `

    <img
      src="${escapeAttribute(
        url
      )}"
      style="
        width:100%;
        height:100%;
        object-fit:cover;
      "
    >

  `;

}


/* =========================================
   DELETE
========================================= */

function openDeleteModal() {

  document
    .getElementById(
      'deleteModal'
    )
    ?.classList
    .add(
      'open'
    );

}


function closeDeleteModal() {

  document
    .getElementById(
      'deleteModal'
    )
    ?.classList
    .remove(
      'open'
    );

}


function confirmDeleteBook() {

  if (
    !state.selectedBook ||
    state.isDeleting
  ) {
    return;
  }


  state.isDeleting =
    true;


  google.script.run

    .withSuccessHandler(
      response => {

        state.isDeleting =
          false;


        closeDeleteModal();


        state.selectedBook =
          null;


        showToast(
          response.message
        );


        google.script.run

          .withSuccessHandler(
            books => {

              handleBooksLoaded(
                books
              );


              navigateTo(
                'library'
              );

            }
          )

          .withFailureHandler(
            handleApiError
          )

          .getBooks();

      }
    )

    .withFailureHandler(
      error => {

        state.isDeleting =
          false;


        handleApiError(
          error
        );

      }
    )

    .deleteBook(
      state.selectedBook.ID
    );

}


/* =========================================
   COVER
========================================= */

function createCoverHTML(book) {

  if (
    book.CoverURL
  ) {

    return `

      <img
        src="${escapeAttribute(
          book.CoverURL
        )}"
        alt="${escapeAttribute(
          book.Title
        )}"
        style="
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

    `;

  }


  return `

    <div class="book-cover-fallback">

      <span class="fallback-mark">
        B
      </span>

      <strong>

        ${escapeHTML(
          book.Title
        )}

      </strong>

    </div>

  `;

}


/* =========================================
   MP3 MUSIC PLAYER
========================================= */

function initializeMusicPlayer() {

  focusAudio =
    document.getElementById(
      'focusAudio'
    );


  if (!focusAudio) {
    return;
  }


  const volumeSlider =
    document.getElementById(
      'focusVolume'
    );


  focusAudio.volume =
    Number(
      volumeSlider?.value || 35
    ) / 100;


  focusAudio.addEventListener(
    'play',
    () => {

      state.music.isPlaying =
        true;

      updateMusicPlayUI();

    }
  );


  focusAudio.addEventListener(
    'pause',
    () => {

      state.music.isPlaying =
        false;

      updateMusicPlayUI();

    }
  );


  focusAudio.addEventListener(
    'timeupdate',
    updateMusicProgress
  );


  focusAudio.addEventListener(
    'loadedmetadata',
    updateMusicProgress
  );


  focusAudio.addEventListener(
    'durationchange',
    updateMusicProgress
  );


  focusAudio.addEventListener(
    'ended',
    nextMusicTrack
  );


  focusAudio.addEventListener(
    'error',
    handleMusicError
  );


  loadMusicTrack(
    0,
    false
  );


  attemptMusicAutoplay();


  document.addEventListener(

    'pointerdown',

    startMusicAfterFirstInteraction,

    {
      once: true
    }

  );


  document.addEventListener(

    'keydown',

    startMusicAfterFirstInteraction,

    {
      once: true
    }

  );

}


function loadMusicTrack(
  index,
  autoplay = true
) {

  if (!focusAudio) {
    return;
  }


  const total =
    MUSIC_TRACKS.length;


  state.music.currentTrack =
    (
      index +
      total
    ) % total;


  const track =
    MUSIC_TRACKS[
      state.music.currentTrack
    ];


  focusAudio.pause();


  focusAudio.src =
    track.audioUrl;


  focusAudio.load();


  setText(
    'focusTrackTitle',
    track.title
  );


  const cover =
    document.getElementById(
      'focusTrackCover'
    );


  if (cover) {

    cover.src =
      track.coverUrl;

  }


  setInputValue(
    'focusProgress',
    0
  );


  setText(
    'focusCurrentTime',
    '0:00'
  );


  setText(
    'focusDuration',
    '0:00'
  );


  if (autoplay) {

    focusAudio
      .play()
      .catch(
        () => {

          state.music.isPlaying =
            false;

          updateMusicPlayUI();

        }
      );

  }

}


function attemptMusicAutoplay() {

  if (
    !focusAudio ||
    state.music.autoplayAttempted
  ) {
    return;
  }


  state.music.autoplayAttempted =
    true;


  focusAudio
    .play()
    .catch(
      () => {

        state.music.isPlaying =
          false;

        updateMusicPlayUI();

      }
    );

}


function startMusicAfterFirstInteraction() {

  if (
    !focusAudio ||
    !focusAudio.paused
  ) {
    return;
  }


  focusAudio
    .play()
    .catch(
      () => {}
    );

}


function toggleMusicPlayback() {

  if (!focusAudio) {
    return;
  }


  if (
    focusAudio.paused
  ) {

    focusAudio
      .play()
      .catch(
        handleMusicError
      );

  } else {

    focusAudio.pause();

  }

}


function updateMusicPlayUI() {

  const button =
    document.getElementById(
      'focusPlayButton'
    );


  const indicator =
    document.getElementById(
      'focusPlayingIndicator'
    );


  const playing =
    focusAudio &&
    !focusAudio.paused;


  if (button) {

    button.textContent =
      playing
        ? '❚❚'
        : '▶';

  }


  if (indicator) {

    indicator.classList.toggle(
      'active',
      Boolean(playing)
    );

  }

}


function nextMusicTrack() {

  loadMusicTrack(
    state.music.currentTrack + 1,
    true
  );

}


function previousMusicTrack() {

  loadMusicTrack(
    state.music.currentTrack - 1,
    true
  );

}


function initializeMusicVolume() {

  const slider =
    document.getElementById(
      'focusVolume'
    );


  if (!slider) {
    return;
  }


  slider.addEventListener(

    'input',

    event => {

      if (!focusAudio) {
        return;
      }


      focusAudio.volume =

        Number(
          event.target.value
        ) / 100;

    }

  );

}


function initializeMusicProgress() {

  const slider =
    document.getElementById(
      'focusProgress'
    );


  if (!slider) {
    return;
  }


  slider.addEventListener(

    'input',

    event => {

      if (
        !focusAudio ||
        !Number.isFinite(
          focusAudio.duration
        ) ||
        focusAudio.duration <= 0
      ) {
        return;
      }


      focusAudio.currentTime =

        focusAudio.duration *

        Number(
          event.target.value
        ) /

        100;

    }

  );

}


function updateMusicProgress() {

  if (!focusAudio) {
    return;
  }


  const current =
    Number.isFinite(
      focusAudio.currentTime
    )
      ? focusAudio.currentTime
      : 0;


  const duration =
    Number.isFinite(
      focusAudio.duration
    )
      ? focusAudio.duration
      : 0;


  const progress =
    duration > 0

      ? current /
        duration *
        100

      : 0;


  setInputValue(
    'focusProgress',
    progress
  );


  setText(
    'focusCurrentTime',
    formatFocusTime(
      current
    )
  );


  setText(
    'focusDuration',
    formatFocusTime(
      duration
    )
  );

}


function handleMusicError(error) {

  console.error(
    'Music error:',
    error
  );


  state.music.isPlaying =
    false;


  updateMusicPlayUI();


  showToast(

    currentLanguage === 'th'

      ? 'ไม่สามารถเล่นเพลงนี้ได้'

      : 'Unable to play this track.'

  );

}


function toggleFocusPlayer() {

  state.music.collapsed =
    !state.music.collapsed;


  document
    .getElementById(
      'focusPlayer'
    )
    ?.classList
    .toggle(

      'collapsed',

      state.music.collapsed

    );

}


/* =========================================
   HELPERS
========================================= */

function calculateClientProgress(
  current,
  total
) {

  if (
    total <= 0
  ) {
    return 0;
  }


  return Number(

    (
      current /
      total *
      100
    )
      .toFixed(1)

  );

}


function formatProgress(value) {

  return Math.max(
    0,
    Math.min(
      100,
      Number(
        value || 0
      )
    )
  );

}


function formatFocusTime(totalSeconds) {

  if (
    !Number.isFinite(
      totalSeconds
    )
  ) {
    return '0:00';
  }


  const seconds =
    Math.floor(
      totalSeconds % 60
    );


  const minutes =
    Math.floor(
      (
        totalSeconds /
        60
      ) % 60
    );


  const hours =
    Math.floor(
      totalSeconds /
      3600
    );


  if (
    hours > 0
  ) {

    return (
      hours +
      ':' +
      String(minutes)
        .padStart(
          2,
          '0'
        ) +
      ':' +
      String(seconds)
        .padStart(
          2,
          '0'
        )
    );

  }


  return (
    minutes +
    ':' +
    String(seconds)
      .padStart(
        2,
        '0'
      )
  );

}


function setText(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.textContent =
      value;

  }

}


function setInputValue(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.value =
      value;

  }

}


function escapeHTML(value) {

  const div =
    document.createElement(
      'div'
    );


  div.textContent =
    String(
      value || ''
    );


  return div.innerHTML;

}


function escapeAttribute(value) {

  return String(
    value || ''
  )

    .replace(
      /&/g,
      '&amp;'
    )

    .replace(
      /"/g,
      '&quot;'
    )

    .replace(
      /</g,
      '&lt;'
    )

    .replace(
      />/g,
      '&gt;'
    );

}


function showToast(message) {

  const toast =
    document.getElementById(
      'toast'
    );


  if (!toast) {
    return;
  }


  setText(
    'toastMessage',
    message
  );


  toast.classList.add(
    'show'
  );


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          'show'
        );

      },
      3000
    );

}


function handleApiError(error) {

  showToast(

    error &&
    error.message

      ? error.message

      : (
          currentLanguage === 'th'
            ? 'เกิดข้อผิดพลาด'
            : 'Something went wrong.'
        )

  );

}


/* =========================================
   INITIALIZE
========================================= */

function initializeApp() {

  applyTheme();

  updateNavigation(
    state.currentView
  );


  document
    .getElementById(
      'addBookForm'
    )
    ?.addEventListener(
      'submit',
      handleAddBook
    );


  document
    .getElementById(
      'librarySearch'
    )
    ?.addEventListener(

      'input',

      event => {

        state.filters.search =
          event.target.value;

        renderLibrary();

      }

    );


  document
    .getElementById(
      'statusFilter'
    )
    ?.addEventListener(

      'change',

      event => {

        state.filters.status =
          event.target.value;

        renderLibrary();

      }

    );


  document
    .getElementById(
      'genreFilter'
    )
    ?.addEventListener(

      'change',

      event => {

        state.filters.genre =
          event.target.value;

        renderLibrary();

      }

    );


  document
    .getElementById(
      'coverURL'
    )
    ?.addEventListener(
      'input',
      updateCoverPreview
    );


  document
    .getElementById(
      'deleteModal'
    )
    ?.addEventListener(

      'click',

      event => {

        if (
          event.target.id ===
          'deleteModal'
        ) {

          closeDeleteModal();

        }

      }

    );


  initializeMusicPlayer();

  initializeMusicVolume();

  initializeMusicProgress();


  loadBooks();


  setTimeout(
    () => {

      applyLanguage();

    },
    0
  );

}


document.addEventListener(
  'DOMContentLoaded',
  initializeApp
);

/* =========================================
   HIDE DUPLICATE ADD BOOK BUTTON
========================================= */

function updateHeaderAddBookButton() {

  const button =
    document.querySelector(
      '.header-add-button'
    );

  const addBookView =
    document.getElementById(
      'view-addBook'
    );


  if (
    !button ||
    !addBookView
  ) {
    return;
  }


  const isAddBookPage =
    addBookView.classList.contains(
      'active'
    );


  if (isAddBookPage) {

    button.style.display =
      'none';

  } else {

    button.style.display =
      '';

  }

}


/* ตรวจจับทุกครั้งที่เปลี่ยนหน้า */

const bookTrackViewObserver =
  new MutationObserver(
    () => {

      updateHeaderAddBookButton();

    }
  );


document
  .querySelectorAll(
    '.app-view'
  )
  .forEach(
    view => {

      bookTrackViewObserver.observe(
        view,
        {
          attributes: true,
          attributeFilter: [
            'class'
          ]
        }
      );

    }
  );


/* ตรวจครั้งแรกตอนเปิดเว็บ */

updateHeaderAddBookButton();
