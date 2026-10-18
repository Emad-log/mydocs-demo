/* Official how-to copy for the MyDocs demo.
   Sources checked against the live pages on 18 Oct 2026. */
(function (root) {
  function src(name, nameFa, url) {
    return { name: name, nameFa: nameFa, url: url };
  }

  var CRA_IN = src(
    "Sign in to your CRA account",
    "ورود به حساب CRA",
    "https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-individuals/account-individuals.html"
  );
  var CRA_SERVICES = src(
    "Services in My Account",
    "خدمات CRA My Account",
    "https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-individuals/account-individuals/about-account/services-my-account.html"
  );
  var NOA = src(
    "Notices of assessment — NOA or NOR",
    "اطلاعیه ارزیابی (NOA یا NOR)",
    "https://www.canada.ca/en/services/taxes/income-tax/personal-income-tax/after-you-file/noa-nor.html"
  );
  var MAIL = src(
    "Email notifications from the CRA – Individuals",
    "اعلان ایمیلی CRA برای اشخاص",
    "https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-individuals/online-mail-helping-you-organize-your-canada-revenue-agency-mail.html"
  );
  var SLIPS = src(
    "Get a copy of your tax slips",
    "گرفتن کپی برگه‌های مالیاتی",
    "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/tax-slips/a-copy-your-tax-slips.html"
  );
  var PAY = src(
    "Confirm a payment to the CRA",
    "تأیید پرداخت به CRA",
    "https://www.canada.ca/en/revenue-agency/services/payments/payments-cra/confirm-payment.html"
  );
  var T2 = src(
    "T2 Corporation Income Tax Return",
    "اظهارنامه شرکتی T2",
    "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2.html"
  );
  var T2VIEW = src(
    "View a corporation’s assessed return",
    "دیدن اظهارنامه ارزیابی‌شده شرکت",
    "https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-businesses/business-account/view-return-initial-assessment-reassessment.html"
  );
  var AFTER = src(
    "After you file your corporation income tax return",
    "بعد از ثبت اظهارنامه مالیاتی شرکت",
    "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/after-you-file-your-corporation-income-tax-return.html"
  );
  var BMAIL = src(
    "Email notifications from the CRA – Businesses",
    "اعلان ایمیلی CRA برای کسب‌وکار",
    "https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-businesses/online-mail-reduce-your-cost-doing-business-saving-time-online.html"
  );
  var OBR = src(
    "Ontario Business Registry",
    "Ontario Business Registry",
    "https://www.ontario.ca/page/ontario-business-registry"
  );
  var CC = src(
    "Order copies of corporate documents",
    "سفارش کپی مدارک شرکتی",
    "https://ised-isde.canada.ca/site/corporations-canada/en/order-copies-corporate-documents"
  );
  var CCFEE = src(
    "Corporations Canada fees and processing times",
    "هزینه و زمان Corporations Canada",
    "https://ised-isde.canada.ca/site/corporations-canada/en/services-fees-and-processing-times"
  );
  var EQ = src(
    "How to get a free Equifax credit report",
    "گزارش رایگان Equifax",
    "https://www.equifax.ca/personal/education/credit-report/articles/-/learn/how-to-get-a-free-credit-report/"
  );
  var EQH = src(
    "Equifax Canada — request your credit report",
    "درخواست گزارش از Equifax Canada",
    "https://www.equifax.ca/personal/help/-/h/c/credit-report/"
  );
  var TU = src(
    "TransUnion Consumer Disclosure",
    "Consumer Disclosure در TransUnion",
    "https://www.transunion.ca/product/consumer-disclosure"
  );
  var FCAC_CR = src(
    "Getting your credit report and credit score",
    "گرفتن گزارش و امتیاز اعتبار",
    "https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score/order-credit-report.html"
  );
  var RECO = src(
    "RECO buyer’s checklist",
    "چک‌لیست خریدار RECO",
    "https://www.reco.on.ca/consumers/information-for-buyers/buyers-checklist"
  );
  var REALTOR = src("REALTOR.ca", "REALTOR.ca", "https://www.realtor.ca/");
  var DEPOSIT = src(
    "Consumer deposit insurance — RECO",
    "بیمه بیعانه مصرف‌کننده، RECO",
    "https://www.reco.on.ca/consumers/consumer-deposit-insurance/"
  );
  var BANK = src(
    "Banking — Financial Consumer Agency of Canada",
    "بانکداری، آژانس مصرف‌کنندگان مالی کانادا",
    "https://www.canada.ca/en/financial-consumer-agency/services/banking.html"
  );
  var PREP = src(
    "Preparing to get a mortgage",
    "آمادگی برای گرفتن وام مسکن",
    "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/preparing-mortgage.html"
  );
  var MORT = src(
    "Mortgages — Financial Consumer Agency of Canada",
    "وام مسکن، آژانس مصرف‌کنندگان مالی کانادا",
    "https://www.canada.ca/en/financial-consumer-agency/services/mortgages.html"
  );
  var TOR = src(
    "Property tax — City of Toronto",
    "مالیات ملک، شهر تورنتو",
    "https://www.toronto.ca/services-payments/property-taxes-utilities/property-tax/"
  );
  var ONID = src(
    "Official government ID and certificates",
    "مدارک شناسایی رسمی انتاریو",
    "https://www.ontario.ca/page/official-government-id-and-certificates"
  );
  var ONG = src(
    "Get a G driver’s licence — new drivers",
    "گواهینامه کلاس G انتاریو",
    "https://www.ontario.ca/page/get-g-drivers-licence-new-drivers"
  );

  root.MYDOCS_CATALOG = [
    {
      id: "dl",
      perApplicant: true,
      ifApplicable: false,
      capture: true,
      kind: "upload",
      presets: ["Purchase", "Refinance", "Self-employed"],
      sources: [ONID, ONG],
      en: {
        name: "Driver licence, front and back",
        lead: "Photograph the plastic driver’s licence your province already issued. Send the front and the back as two clear photos.",
        steps: [
          "Lay the card on a dark, flat surface in daylight or under a lamp.",
          "On this item, Take photo opens the camera. You can also choose a file or a PDF.",
          "Fill the frame with the card. All four corners in, no glare, and nothing covering the photo, name, or expiry.",
          "Photograph the back on its own so the barcode and any conditions are readable.",
          "Send both. One side alone gets sent back."
        ],
        note: "In Ontario, ServiceOntario issues the driver’s licence card. A licence from another province is fine: photograph that card. An Ontario Photo Card is not a driver’s licence."
      },
      fa: {
        name: "گواهینامه رانندگی، رو و پشت",
        lead: "از همان کارت پلاستیکی که استان‌تان صادر کرده عکس بگیرید، هم رو و هم پشت. دو عکس جدا و خوانا کافی است.",
        steps: [
          "کارت را روی یک سطح تیره و صاف بگذارید، زیر نور روز یا چراغ.",
          "در همین مورد، دکمه گرفتن عکس دوربین را باز می‌کند. می‌توانید فایل یا PDF هم انتخاب کنید.",
          "کارت تمام کادر را پر کند. هر چهار گوشه داخل عکس باشد، برق نیفتد، و انگشت روی عکس، نام، یا تاریخ انقضا نباشد.",
          "پشت کارت را جدا عکس بگیرید تا بارکد و شرط‌ها خوانا باشد.",
          "هر دو را بفرستید. یک طرف به‌تنهایی برمی‌گردد."
        ],
        note: "در انتاریو کارت گواهینامه را ServiceOntario صادر می‌کند. اگر گواهینامه‌تان مال استان دیگری است، همان کارت را بفرستید. Ontario Photo Card گواهینامه رانندگی نیست."
      }
    },
    {
      id: "aps",
      perApplicant: false,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Self-employed"],
      sources: [RECO],
      en: {
        name: "Purchase and sale agreement",
        lead: "This is the signed contract between the buyer and the seller, not the listing and not an email thread.",
        steps: [
          "Ask your realtor or real estate lawyer for the agreement of purchase and sale.",
          "Include every page, every schedule, and any amendment, waiver, or notice of fulfillment.",
          "Names, the property address, the price, the deposit, and the dates need to be readable.",
          "One PDF of the signed copy is best. A draft that nobody has signed is not enough."
        ],
        note: "If the property is in Ontario, the agent is regulated by the Real Estate Council of Ontario (RECO). Other provinces have their own regulator, but the document you send is still the signed agreement from your brokerage or lawyer."
      },
      fa: {
        name: "قرارداد خرید و فروش",
        lead: "این قرارداد امضاشده بین خریدار و فروشنده است، نه آگهی ملک و نه رشته ایمیل.",
        steps: [
          "از مشاور املاک یا وکیل ملکی‌تان قرارداد خرید و فروش را بخواهید.",
          "همه صفحه‌ها، همه پیوست‌ها، و هر اصلاحیه، انصراف از شرط، یا نامه انجام شرط را بگذارید.",
          "نام‌ها، نشانی ملک، قیمت، بیعانه، و تاریخ‌ها باید خوانا باشد.",
          "یک PDF از نسخه امضاشده بهتر است. پیش‌نویسِ امضانشده کافی نیست."
        ],
        note: "اگر ملک در انتاریو است، مشاور را RECO نظارت می‌کند. استان‌های دیگر ناظر خودشان را دارند، ولی مدرکی که می‌فرستید همان قرارداد امضاشده از دفتر املاک یا وکیل است."
      }
    },
    {
      id: "mls",
      perApplicant: false,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Self-employed"],
      sources: [REALTOR],
      en: {
        name: "MLS listing",
        lead: "The full listing for the property, with the MLS number, not a cropped photo of the kitchen.",
        steps: [
          "Ask your realtor for the listing sheet, or open the property on REALTOR.ca.",
          "Save the full listing: price, address, MLS number, and the property details.",
          "A screenshot that cuts off the MLS number or the address is not enough."
        ],
        note: "REALTOR.ca is the national public site for listings from REALTORS. Your realtor’s own PDF of the listing is fine too."
      },
      fa: {
        name: "آگهی MLS",
        lead: "آگهی کامل ملک، با شماره MLS. عکس بریده از آشپزخانه کافی نیست.",
        steps: [
          "برگه آگهی را از مشاور املاک بخواهید، یا خود ملک را در REALTOR.ca باز کنید.",
          "آگهی کامل را ذخیره کنید: قیمت، نشانی، شماره MLS، و مشخصات ملک.",
          "اسکرین‌شاتی که شماره MLS یا نشانی را بریده باشد کافی نیست."
        ],
        note: "REALTOR.ca سایت سراسری آگهی‌های مشاوران رسمی است. PDF خودِ مشاور هم قبول است."
      }
    },
    {
      id: "dep",
      perApplicant: false,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Self-employed"],
      sources: [DEPOSIT],
      en: {
        name: "Deposit receipt",
        lead: "The receipt for the deposit paid into the brokerage’s trust account. This is not the bank draft.",
        steps: [
          "Ask the brokerage that holds the deposit (often the listing brokerage) for the trust receipt.",
          "It should show the amount, the date, the property, and the buyers’ names.",
          "If there was more than one deposit, send every receipt."
        ],
        note: "In Ontario, a registered brokerage holds the buyer’s deposit in a statutory trust account. RECO’s consumer deposit insurance page describes that holding. The receipt itself comes from the brokerage."
      },
      fa: {
        name: "رسید بیعانه",
        lead: "رسید بیعانه‌ای که به حساب امانی دفتر املاک واریز شده. این حواله بانکی نیست.",
        steps: [
          "از همان دفتر املاکی که بیعانه را نگه داشته (اغلب دفتر فروشنده) رسید حساب امانی را بخواهید.",
          "مبلغ، تاریخ، ملک، و نام خریداران باید روی رسید باشد.",
          "اگر بیش از یک بیعانه داده‌اید، رسید همه را بفرستید."
        ],
        note: "در انتاریو دفتر املاکِ ثبت‌شده بیعانه خریدار را در حساب امانی قانونی نگه می‌دارد. صفحه بیمه بیعانه RECO همین را توضیح می‌دهد. خودِ رسید را دفتر املاک می‌دهد."
      }
    },
    {
      id: "depd",
      perApplicant: false,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase"],
      sources: [BANK],
      en: {
        name: "Copy of the deposit draft",
        lead: "A copy of the bank draft or certified cheque you used to pay the deposit. Your bank issues it.",
        steps: [
          "Photograph or scan the draft before you hand it over, or ask the bank that issued it for a copy.",
          "The bank name, amount, date, and draft number need to be readable.",
          "Include the back as well if it was endorsed.",
          "Your realtor may already have a scan. You can ask them."
        ],
        note: "The Financial Consumer Agency of Canada is the federal consumer authority for banks. It does not print the draft. The PDF or photo comes from your bank or from the scan your realtor kept."
      },
      fa: {
        name: "کپی حواله بانکی بیعانه",
        lead: "کپی همان bank draft یا چک تضمینی که برای بیعانه کشیده‌اید. بانک شما آن را صادر می‌کند.",
        steps: [
          "قبل از تحویل، از حواله عکس یا اسکن بگیرید، یا از همان بانک یک کپی بخواهید.",
          "نام بانک، مبلغ، تاریخ، و شماره حواله باید خوانا باشد.",
          "اگر پشت حواله هم امضا یا ظهرنویسی دارد، پشت را هم بفرستید.",
          "ممکن است مشاور املاک از قبل اسکن را داشته باشد. از او بخواهید."
        ],
        note: "آژانس مصرف‌کنندگان مالی کانادا مرجع فدرال حقوق مشتری بانک است. خودش حواله چاپ نمی‌کند. فایل از بانک شماست، یا از اسکنی که مشاور نگه داشته."
      }
    },
    {
      id: "sav",
      perApplicant: true,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Self-employed"],
      sources: [BANK],
      en: {
        name: "Savings, RRSP, and TFSA statements, 3 months",
        lead: "Official PDF statements for the last 3 months, for each savings, RRSP, and TFSA account this person has.",
        steps: [
          "Sign in to the online banking or app of the institution that holds the account.",
          "Open the account, then Statements (sometimes called Documents or eStatements).",
          "Download the PDF for each of the last 3 months. A screenshot of the balance is not a statement.",
          "Your name, the account, and the period should show on the PDF.",
          "Repeat for every savings account, RRSP, and TFSA. Skip an account type only if this person does not have one, and tell your broker."
        ],
        note: "These statements come from the bank, credit union, or investment firm, not from CRA My Account. CRA can show RRSP room. That is not the statement."
      },
      fa: {
        name: "صورت‌حساب سه‌ماهه پس‌انداز، RRSP و TFSA",
        lead: "صورت‌حساب PDF رسمیِ سه ماه اخیر، برای هر حساب پس‌انداز، RRSP و TFSA که این شخص دارد.",
        steps: [
          "وارد بانکداری اینترنتی یا اپ همان مؤسسه‌ای شوید که حساب آنجاست.",
          "حساب را باز کنید و بروید به Statements. گاهی اسمش Documents یا eStatements است.",
          "PDF هر کدام از سه ماه اخیر را دانلود کنید. اسکرین‌شات موجودی، صورت‌حساب نیست.",
          "نام شما، شماره حساب، و بازه تاریخ باید روی PDF باشد.",
          "برای هر پس‌انداز، RRSP و TFSA تکرار کنید. فقط اگر آن نوع حساب را ندارد نفرستید، و به مشاور وام بگویید."
        ],
        note: "این صورت‌حساب را بانک، credit union، یا شرکت سرمایه‌گذاری می‌دهد، نه CRA My Account. CRA سقف RRSP را نشان می‌دهد. آن صورت‌حساب نیست."
      }
    },
    {
      id: "t1",
      perApplicant: true,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Refinance", "Self-employed"],
      sources: [CRA_SERVICES, CRA_IN],
      en: {
        name: "T1 General, last 2 years",
        lead: "Your T1 General is the personal return you filed. It is not the Notice of Assessment. Send the last 2 years.",
        steps: [
          "Sign in to CRA My Account and select your Individual account.",
          "Open Tax returns and select the year.",
          "Open the assessed return. Save a PDF from your browser’s print dialog, or attach the PDF your tax software kept when you NETFILEd (Wealthsimple Tax, TurboTax, and similar).",
          "Include the schedules that were filed with the return.",
          "Repeat for the second year. The amounts should match that year’s Notice of Assessment."
        ],
        note: "Do not download a blank T1 from canada.ca and fill it in. If My Account will not show the full return, call 1-800-959-8281 and ask CRA to send a copy of the filed return."
      },
      fa: {
        name: "اظهارنامه T1 General، دو سال اخیر",
        lead: "T1 General همان اظهارنامه شخصی است که ثبت کرده‌اید. Notice of Assessment نیست. دو سال اخیر را بفرستید.",
        steps: [
          "وارد CRA My Account شوید و حساب Individual را انتخاب کنید.",
          "Tax returns را باز کنید و سال را انتخاب کنید.",
          "اظهارنامه ارزیابی‌شده را باز کنید. از چاپ مرورگر PDF ذخیره کنید، یا همان PDF را بفرستید که نرم‌افزار مالیاتی موقع NETFILE نگه داشته (مثل Wealthsimple Tax یا TurboTax).",
          "جدول‌هایی که با اظهارنامه رفته (schedules) را هم بگذارید.",
          "برای سال دوم تکرار کنید. رقم‌ها باید با Notice of Assessment همان سال یکی باشد."
        ],
        note: "فرم خالی T1 را از canada.ca دانلود نکنید که خودتان پر کنید. اگر در CRA My Account فایل کامل را ندیدید، با 1-800-959-8281 زنگ بزنید و کپی اظهارنامه ثبت‌شده را بخواهید."
      }
    },
    {
      id: "noa",
      perApplicant: true,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Refinance", "Self-employed"],
      sources: [NOA, MAIL, CRA_IN],
      en: {
        name: "Notice of Assessment, last 2 years",
        lead: "The notice CRA sends after it processes the return. Your broker needs the original CRA PDF for each of the last 2 years, not a photo of the letter and not a screenshot.",
        steps: [
          "Sign in to CRA My Account and select your Individual account.",
          "Open Tax returns or Mail.",
          "Open the Notice of Assessment for that year. If CRA later issued a Notice of Reassessment, send the latest one.",
          "In Mail, open the notice and save the print-friendly PDF. Upload that CRA file here.",
          "Do the same for the second year."
        ],
        note: "Notices issued after 9 February 2015 are available this way. Both the online PDF and the paper letter are official CRA notices. A Proof of income statement (option C) is a different document. If you cannot get the PDF, call 1-800-959-8281. A photo of the paper notice is often rejected."
      },
      fa: {
        name: "اطلاعیه ارزیابی، دو سال اخیر",
        lead: "نامه‌ای که CRA بعد از رسیدگی به اظهارنامه می‌فرستد. مشاور وام PDF اصلی خودِ CRA را برای هر کدام از دو سال اخیر می‌خواهد، نه عکس نامه کاغذی و نه اسکرین‌شات.",
        steps: [
          "وارد CRA My Account شوید و حساب Individual را انتخاب کنید.",
          "Tax returns یا Mail را باز کنید.",
          "Notice of Assessment همان سال را باز کنید. اگر بعداً Notice of Reassessment آمده، همان نسخه جدیدتر را بفرستید.",
          "داخل Mail نامه را باز کنید و PDF مخصوص چاپ را ذخیره کنید. همان فایل CRA را اینجا بفرستید.",
          "برای سال دوم همین کار را بکنید."
        ],
        note: "نامه‌های بعد از ۹ فوریه ۲۰۱۵ این‌طور در دسترس‌اند. هم PDF آنلاین و هم نامه کاغذی، اطلاعیه رسمی CRA است. Proof of income statement (option C) مدرک دیگری است. اگر به PDF نرسیدید با 1-800-959-8281 تماس بگیرید. عکس از نامه کاغذی اغلب برمی‌گردد."
      }
    },
    {
      id: "aoi",
      perApplicant: false,
      ifApplicable: true,
      capture: false,
      kind: "upload",
      presets: ["Self-employed"],
      sources: [OBR, CC, CCFEE],
      en: {
        name: "Articles of incorporation",
        lead: "The articles that created the company, or later articles of amendment if those replaced them. Not a business-name registration, and not the CRA business-number letter.",
        steps: [
          "If the company was incorporated in Ontario, search it on the Ontario Business Registry.",
          "Order a document copy of the Articles of Incorporation. From the ministry that copy is $3. Signed in to the entity, open Request Search Products, then Document Copies. A profile report is $8 and lists the document name and filing date.",
          "If the company is federal, order the articles online from Corporations Canada. You need the corporate name and the corporation number.",
          "Uncertified federal copies ordered online are free. The service standard is 1 day. Your lawyer or accountant may already have the PDF."
        ],
        note: "Other provinces keep their own corporate registries. Order the articles from the registry that incorporated the company."
      },
      fa: {
        name: "مدارک ثبت شرکت",
        lead: "همان Articles of Incorporation که شرکت با آن ساخته شده، یا Articles of Amendment اگر بعداً جایگزین شده باشد. گواهی اسم تجاری نیست، و نامه Business Number از CRA هم نیست.",
        steps: [
          "اگر شرکت در انتاریو ثبت شده، آن را در Ontario Business Registry جستجو کنید.",
          "کپی Articles of Incorporation را سفارش دهید. اگر مستقیم از وزارت بگیرید، ۳ دلار است. وقتی با حساب همان شرکت وارد شده‌اید، Request Search Products و بعد Document Copies را بزنید. profile report هشت دلار است و اسم سند و تاریخ ثبت را فهرست می‌کند.",
          "اگر شرکت فدرال است، articles را آنلاین از Corporations Canada سفارش دهید. نام شرکت و شماره شرکت را لازم دارید.",
          "کپی عادی فدرال که آنلاین بخواهید رایگان است. زمان استاندارد خدمات یک روز است. وکیل یا حسابدار ممکن است PDF را از قبل داشته باشد."
        ],
        note: "استان‌های دیگر ثبت شرکت خودشان را دارند. مدارک را از همان ثبتی بگیرید که شرکت آنجا ساخته شده."
      }
    },
    {
      id: "t2",
      perApplicant: false,
      ifApplicable: true,
      capture: false,
      kind: "upload",
      presets: ["Self-employed"],
      sources: [T2, T2VIEW, AFTER],
      en: {
        name: "T2, last 2 years",
        lead: "The corporation’s T2 return for each of the last 2 tax years, as it was filed, with the schedules that went with it. A blank T2 from canada.ca is not the document.",
        steps: [
          "Ask the accountant who filed the return for the PDF for each year.",
          "You can also sign in to My Business Account, open Corporation Income Tax, and use View return status to open the assessed return. That screen shows the assessed T2 and its schedules.",
          "The company Notice of Assessment is a separate document. Send both."
        ],
        note: "The T2 is the federal corporate return. Corporations in Quebec or Alberta also file a separate provincial corporate return. If that is you, ask the accountant for the provincial return as well."
      },
      fa: {
        name: "اظهارنامه T2، دو سال اخیر",
        lead: "اظهارنامه T2 شرکت برای هر کدام از دو سال مالیاتی اخیر، همان نسخه‌ای که ثبت شده، با جدول‌های همراهش. فرم خالی T2 از canada.ca این مدرک نیست.",
        steps: [
          "از حسابداری که اظهارنامه را ثبت کرده، PDF هر سال را بخواهید.",
          "می‌توانید وارد CRA My Business Account شوید، Corporation Income Tax را باز کنید، و از View return status اظهارنامه ارزیابی‌شده را ببینید. آن صفحه T2 ارزیابی‌شده و جدول‌هایش را نشان می‌دهد.",
          "اطلاعیه ارزیابی شرکت مدرک جداست. هر دو را بفرستید."
        ],
        note: "T2 اظهارنامه فدرال شرکت است. شرکت‌های کبک و آلبرتا یک اظهارنامه استانی جدا هم می‌دهند. اگر شرکت شما آنجاست، اظهارنامه استانی را هم از حسابدار بگیرید."
      }
    },
    {
      id: "cnoa",
      perApplicant: false,
      ifApplicable: true,
      capture: false,
      kind: "upload",
      presets: ["Self-employed"],
      sources: [AFTER, BMAIL],
      en: {
        name: "Company Notice of Assessment, last 2 years",
        lead: "The CRA notice of assessment for the corporation, for each of the last 2 years. Not the T2 return itself.",
        steps: [
          "Sign in to your CRA account and select the Business account (My Business Account). A representative uses Represent a Client.",
          "Open Mail from the mail icon on the welcome page, or Mail on the overview.",
          "Open the Notice of Assessment for that tax year. If the return was reassessed, send the latest notice.",
          "Download or print the PDF, and repeat for the second year."
        ],
        note: "Most business correspondence is posted to My Business Account by default. If you are registered for email notifications, CRA emails you when new mail is waiting. The mail itself stays inside the account."
      },
      fa: {
        name: "اطلاعیه ارزیابی شرکت، دو سال اخیر",
        lead: "اطلاعیه ارزیابی CRA برای خودِ شرکت، برای هر کدام از دو سال اخیر. این خودِ اظهارنامه T2 نیست.",
        steps: [
          "وارد حساب CRA شوید و حساب Business را انتخاب کنید، یعنی CRA My Business Account. نماینده از Represent a Client استفاده می‌کند.",
          "از آیکن نامه در صفحه خوش‌آمد، یا از Mail در صفحه کلی، نامه‌ها را باز کنید.",
          "Notice of Assessment همان سال مالیاتی را باز کنید. اگر اظهارنامه دوباره ارزیابی شده، آخرین نامه را بفرستید.",
          "PDF را دانلود یا چاپ کنید و برای سال دوم تکرار کنید."
        ],
        note: "بیشتر نامه‌های کسب‌وکار به‌طور پیش‌فرض داخل CRA My Business Account می‌آید. اگر اعلان ایمیلی را روشن کرده باشید، CRA خبر می‌دهد که نامه جدید آمده. خودِ نامه داخل حساب می‌ماند."
      }
    },
    {
      id: "cbank",
      perApplicant: false,
      ifApplicable: true,
      capture: false,
      kind: "upload",
      presets: ["Self-employed"],
      sources: [BANK],
      en: {
        name: "Company bank statements, 6 months",
        lead: "Official PDF statements for the company’s operating account, for the last 6 months. The bank or credit union issues them.",
        steps: [
          "Sign in to the business online banking for that account.",
          "Open Statements and download each month’s PDF.",
          "The company name, the account, and the month should show.",
          "Include every page. A spreadsheet export or a screenshot without the bank’s statement header is usually rejected."
        ],
        note: "The Financial Consumer Agency of Canada oversees federally regulated banks. It does not host your statements. Download them from the institution that holds the company account."
      },
      fa: {
        name: "صورت‌حساب بانکی شرکت، شش ماه",
        lead: "صورت‌حساب PDF رسمی حساب جاری شرکت، برای شش ماه اخیر. بانک یا credit union آن را صادر می‌کند.",
        steps: [
          "وارد بانکداری اینترنتی تجاری همان حساب شوید.",
          "Statements را باز کنید و PDF هر ماه را دانلود کنید.",
          "نام شرکت، حساب، و ماه باید دیده شود.",
          "همه صفحه‌ها را بفرستید. خروجی اکسل، یا اسکرین‌شات بدون سربرگ صورت‌حساب بانک، معمولاً برمی‌گردد."
        ],
        note: "آژانس مصرف‌کنندگان مالی کانادا بر بانک‌های تحت نظارت فدرال نظارت دارد. صورت‌حساب شما آنجا نیست. از همان مؤسسه‌ای دانلود کنید که حساب شرکت پیش اوست."
      }
    },
    {
      id: "emp",
      perApplicant: true,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Refinance"],
      sources: [PREP],
      en: {
        name: "Employment letter",
        lead: "A current letter from the employer. Not a pay stub, not an offer letter, and not a T4.",
        steps: [
          "Ask HR or your manager for a letter on company letterhead, signed and dated.",
          "It has to state your position.",
          "It has to state your salary: annual, or the hourly rate and usual hours.",
          "It has to state your start date, and whether you are full-time or part-time.",
          "It has to name the person who signed and give their title."
        ],
        note: "There is no government form. Your employer writes it. Lenders use income, before tax, to decide if a mortgage is affordable. The Financial Consumer Agency of Canada explains that test."
      },
      fa: {
        name: "نامه اشتغال به کار",
        lead: "یک نامه به‌روز از کارفرما. فیش حقوقی نیست، نامه پیشنهاد کار نیست، و T4 هم نیست.",
        steps: [
          "از منابع انسانی یا مدیرتان نامه‌ای روی سربرگ شرکت بخواهید، با تاریخ و امضا.",
          "سمت شما باید در نامه باشد.",
          "حقوق باید باشد: سالانه، یا نرخ ساعتی به‌همراه ساعت کار معمول.",
          "تاریخ شروع، و تمام‌وقت یا پاره‌وقت بودن، باید باشد.",
          "نام و سمت کسی که امضا کرده باید باشد."
        ],
        note: "فرم دولتی ندارد. کارفرما آن را می‌نویسد. وام‌دهنده با درآمد قبل از مالیات می‌سنجد که وام مسکن در توان شما هست یا نه. آژانس مصرف‌کنندگان مالی کانادا همین سنجش را توضیح می‌دهد."
      }
    },
    {
      id: "t4",
      perApplicant: true,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Refinance"],
      sources: [SLIPS, CRA_SERVICES, CRA_IN],
      en: {
        name: "T4, last 2 years",
        lead: "The T4 slip from each employer, for each of the last 2 years. A pay stub is not a T4.",
        steps: [
          "Ask the employer for a copy, or get it from CRA after the employer has filed it. Most slips arrive by the end of February. T3 and T5013 slips can be later.",
          "Sign in to CRA My Account, select Individual, and open Tax information slips.",
          "Choose the year, then the T4, and print or save it.",
          "If you had more than one job, include every T4."
        ],
        note: "CRA cannot show a slip until the issuer has sent it. If the slip is missing because the name or social insurance number on it was wrong, ask the employer to fix it. It will not appear in My Account until they do."
      },
      fa: {
        name: "برگه T4، دو سال اخیر",
        lead: "برگه T4 از هر کارفرما، برای هر کدام از دو سال اخیر. فیش حقوقی T4 نیست.",
        steps: [
          "از کارفرما کپی بگیرید، یا بعد از اینکه کارفرما آن را برای CRA فرستاد از خود CRA بگیرید. بیشتر برگه‌ها تا پایان فوریه می‌رسند. برگه‌هایی مثل T3 و T5013 ممکن است دیرتر بیایند.",
          "وارد CRA My Account شوید، Individual را انتخاب کنید، و Tax information slips را باز کنید.",
          "سال را انتخاب کنید، بعد T4 را، و آن را چاپ یا ذخیره کنید.",
          "اگر بیش از یک شغل داشته‌اید، T4 همه را بفرستید."
        ],
        note: "تا وقتی صادرکننده برگه را نفرستاده، CRA آن را نشان نمی‌دهد. اگر به‌خاطر اشتباه در نام یا شماره بیمه اجتماعی در حساب نیست، از کارفرما بخواهید اصلاح کند. تا آن وقت در CRA My Account نمی‌آید."
      }
    },
    {
      id: "pbank",
      perApplicant: true,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Refinance", "Self-employed"],
      sources: [BANK],
      en: {
        name: "Personal bank statements, 3 months",
        lead: "Official PDF statements for the last 3 months, for the account your pay goes into and any other chequing account you use.",
        steps: [
          "Sign in to your online banking or app.",
          "Open the account, then Statements, and download each month’s PDF.",
          "Send every page. Your name has to be visible.",
          "A screenshot of the balance, or a CSV export, is not a statement."
        ],
        note: "Your bank or credit union issues the statement. The Financial Consumer Agency of Canada explains your rights as a banking customer. It does not store your statements."
      },
      fa: {
        name: "صورت‌حساب بانکی شخصی، سه ماه اخیر",
        lead: "صورت‌حساب PDF رسمیِ سه ماه اخیر، برای حسابی که حقوق به آن می‌آید و هر حساب جاری دیگری که استفاده می‌کنید.",
        steps: [
          "وارد بانکداری اینترنتی یا اپ خودتان شوید.",
          "حساب را باز کنید، بروید به Statements، و PDF هر ماه را دانلود کنید.",
          "همه صفحه‌ها را بفرستید. نام شما باید دیده شود.",
          "اسکرین‌شات موجودی، یا خروجی CSV، صورت‌حساب نیست."
        ],
        note: "بانک یا credit union شما صورت‌حساب را صادر می‌کند. آژانس مصرف‌کنندگان مالی کانادا حقوق شما را به‌عنوان مشتری بانک توضیح می‌دهد. صورت‌حساب‌ها آنجا نگهداری نمی‌شود."
      }
    },
    {
      id: "cr",
      perApplicant: true,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Purchase", "Refinance", "Self-employed"],
      sources: [EQ, EQH, TU, FCAC_CR],
      en: {
        name: "Credit report",
        lead: "A free consumer credit report from Equifax Canada or TransUnion Canada. Ordering it does not change your score. One bureau is enough unless your broker asks for both.",
        steps: [
          "Equifax: create or open a myEquifax account from Equifax Canada’s free credit-report page.",
          "In myEquifax, open Credit Report in the left menu, then use PDF Download / PRINT. Upload that PDF.",
          "You can also call Equifax at 1-800-465-7166, or mail a request with two pieces of ID. The phone line asks for your social insurance number. Mail and in person do not require it.",
          "TransUnion: open the Consumer Disclosure page and request the free disclosure online. You can also mail the form, or call 1-800-663-9980.",
          "Download the Consumer Disclosure. That is the full report. In Ontario and Quebec it includes the score, because the law there requires it."
        ],
        note: "Skip sites that advertise a “free score” and then sell your information. Equifax says the report you download from myEquifax is stored by its U.S. affiliate, Equifax Consumer Services LLC. It is still the Equifax Canada report. The Financial Consumer Agency of Canada confirms both bureaus must give you the report for free."
      },
      fa: {
        name: "گزارش اعتبار",
        lead: "گزارش اعتبار رایگان از Equifax Canada یا TransUnion Canada. گرفتنش امتیاز شما را عوض نمی‌کند. مگر مشاور وام هر دو را خواسته باشد، یکی کافی است.",
        steps: [
          "Equifax: از صفحه گزارش رایگان Equifax Canada یک حساب myEquifax بسازید یا واردش شوید.",
          "در myEquifax، از منوی چپ Credit Report را باز کنید و PDF Download / PRINT را بزنید. همان PDF را اینجا بفرستید.",
          "می‌توانید به Equifax زنگ بزنید: 1-800-465-7166. یا با دو مدرک شناسایی درخواست پستی بدهید. تلفن شماره بیمه اجتماعی می‌خواهد. پست و مراجعه حضوری آن را لازم ندارند.",
          "TransUnion: صفحه Consumer Disclosure را باز کنید و نسخه رایگان را آنلاین بخواهید. فرم پستی هم هست، یا تلفن 1-800-663-9980.",
          "Consumer Disclosure را دانلود کنید. این گزارش کامل است. در انتاریو و کبک امتیاز هم داخلش است، چون قانون همان استان‌ها این را لازم کرده."
        ],
        note: "سایت‌هایی که «امتیاز رایگان» تبلیغ می‌کنند و بعد اطلاعات‌تان را می‌فروشند کنار بگذارید. Equifax می‌گوید گزارشی که از myEquifax دانلود می‌کنید پیش شرکت وابسته آمریکایی‌اش، Equifax Consumer Services LLC، نگهداری می‌شود. با این حال همان گزارش Equifax Canada است. آژانس مصرف‌کنندگان مالی کانادا تأیید می‌کند هر دو شرکت باید گزارش را رایگان بدهند."
      }
    },
    {
      id: "ptax",
      perApplicant: false,
      ifApplicable: true,
      capture: false,
      kind: "upload",
      presets: ["Refinance"],
      sources: [TOR],
      en: {
        name: "Property tax bill",
        lead: "The tax bill from the city or town, not the MPAC assessment. MPAC values the property. The municipality sends the bill.",
        steps: [
          "Sign in to the property-tax account on your municipality’s site, or use the bill that was mailed to you.",
          "Download the latest interim or final bill as a PDF. An e-bill is fine.",
          "The roll number, the address, and the amount should show.",
          "In Toronto, use the City of Toronto property-tax lookup to open the account, enrol in eBilling, and get the bill."
        ],
        note: "Every municipality issues its own bill. Toronto’s page is the official example for that city. If the property is elsewhere, use that city or town’s tax office, not MPAC and not Toronto."
      },
      fa: {
        name: "قبض مالیات ملک",
        lead: "قبض را شهرداری می‌فرستد، نه MPAC. MPAC ارزش ملک را ارزیابی می‌کند. قبض مالیات را شهر یا شهرستان می‌فرستد.",
        steps: [
          "وارد حساب مالیات ملک در سایت شهرداری‌تان شوید، یا همان قبضی را که پست شده استفاده کنید.",
          "آخرین قبض علی‌الحساب یا نهایی را PDF بگیرید. قبض الکترونیکی قبول است.",
          "شماره رول، نشانی، و مبلغ باید دیده شود.",
          "در تورنتو از Property Tax Lookup شهر تورنتو حساب را باز کنید، eBilling را فعال کنید، و قبض را بگیرید."
        ],
        note: "هر شهرداری قبض خودش را می‌دهد. صفحه تورنتو فقط نمونه رسمی همان شهر است. اگر ملک جای دیگری است، از اداره مالیات همان شهر استفاده کنید، نه MPAC و نه تورنتو."
      }
    },
    {
      id: "mstmt",
      perApplicant: false,
      ifApplicable: true,
      capture: false,
      kind: "upload",
      presets: ["Refinance"],
      sources: [MORT],
      en: {
        name: "Mortgage statement",
        lead: "The latest statement from the lender that holds the current mortgage, or the annual mortgage statement.",
        steps: [
          "Sign in to that lender’s online banking or mortgage portal.",
          "Open the mortgage and download the latest statement.",
          "The balance, interest rate, payment, maturity date, and property address should show."
        ],
        note: "Your lender issues this statement. There is no CRA or city version. The Financial Consumer Agency of Canada’s mortgage pages explain how Canadian mortgages work. They are not a download portal."
      },
      fa: {
        name: "صورت‌حساب وام مسکن",
        lead: "آخرین صورت‌حساب از همان وام‌دهنده‌ای که وام فعلی پیش اوست، یا annual mortgage statement.",
        steps: [
          "وارد بانکداری اینترنتی یا درگاه وام همان وام‌دهنده شوید.",
          "وام مسکن را باز کنید و آخرین صورت‌حساب را دانلود کنید.",
          "مانده، نرخ بهره، مبلغ قسط، تاریخ سررسید، و نشانی ملک باید دیده شود."
        ],
        note: "خودِ وام‌دهنده این صورت‌حساب را می‌دهد. نسخه CRA یا شهرداری وجود ندارد. صفحه‌های وام مسکنِ آژانس مصرف‌کنندگان مالی کانادا توضیح می‌دهد وام در کانادا چطور کار می‌کند. محل دانلود صورت‌حساب نیست."
      }
    },
    {
      id: "contact",
      perApplicant: false,
      ifApplicable: false,
      capture: false,
      kind: "form",
      presets: ["Purchase", "Refinance", "Self-employed"],
      sources: [],
      en: {
        name: "Contact information and email",
        lead: "This is a form on this page, not a file to upload. Enter the phone, email, and current address you actually answer.",
        steps: [
          "Use a phone you pick up, and an inbox you check.",
          "The address is where you live now, even if the mail on your licence is old.",
          "Save the form. Your broker sees it with the rest of the file."
        ],
        note: "There is no government page for this item. You type it here. Nothing else to order or download."
      },
      fa: {
        name: "اطلاعات تماس و ایمیل",
        lead: "این یک فرم در همین صفحه است، نه فایلی برای بارگذاری. تلفن، ایمیل، و نشانی فعلی را بنویسید، همان‌ها که واقعاً جواب می‌دهید.",
        steps: [
          "شماره‌ای باشد که جواب می‌دهید، و ایمیلی که چک می‌کنید.",
          "نشانی، جایی است که الان زندگی می‌کنید، حتی اگر روی گواهینامه نشانی قدیمی باشد.",
          "فرم را ذخیره کنید. مشاور وام آن را با بقیه پرونده می‌بیند."
        ],
        note: "برای این مورد صفحه دولتی وجود ندارد. همین‌جا تایپ می‌کنید. چیز دیگری برای سفارش یا دانلود نیست."
      }
    },
    {
      id: "cra",
      perApplicant: false,
      ifApplicable: false,
      capture: false,
      kind: "upload",
      presets: ["Self-employed"],
      sources: [PAY, CRA_IN],
      en: {
        name: "CRA tax payment receipt, last year",
        lead: "Proof of what you paid the CRA last year. CRA does not email a receipt the moment you pay. The proof is the payment on your account.",
        steps: [
          "Sign in to CRA My Account and select your Individual account.",
          "Select Accounts and payments. You will see the account balance, available payments, and instalment payments.",
          "Open the statement of account if it is listed, and save or print a PDF that shows last year’s payment."
        ],
        note: "Wait before you look. An online payment can take 3 business days to appear. A cheque or money order can take 10 business days plus mailing time. If you cannot get into My Account, call 1-800-959-8281 and choose option 4 for the balance."
      },
      fa: {
        name: "رسید پرداخت مالیات CRA، سال گذشته",
        lead: "مدرک اینکه سال گذشته به CRA چقدر پرداخت کرده‌اید. CRA همان لحظه پرداخت، ایمیل رسید نمی‌فرستد. مدرک، خودِ پرداخت روی حساب است.",
        steps: [
          "وارد CRA My Account شوید و حساب Individual را انتخاب کنید.",
          "Accounts and payments را انتخاب کنید. موجودی حساب، پرداخت‌های آزاد، و قسط‌ها را می‌بینید.",
          "اگر statement of account آمده، آن را باز کنید و PDF را طوری ذخیره یا چاپ کنید که پرداخت سال گذشته دیده شود."
        ],
        note: "قبل از چک کردن صبر کنید. پرداخت آنلاین ممکن است ۳ روز کاری طول بکشد تا بیاید. چک یا money order حدود ۱۰ روز کاری به‌اضافه زمان پست. اگر وارد CRA My Account نمی‌شوید، با 1-800-959-8281 تماس بگیرید و گزینه ۴ را برای موجودی انتخاب کنید."
      }
    }
  ];
})(typeof window !== "undefined" ? window : globalThis);
