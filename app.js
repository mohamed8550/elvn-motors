const translations = {
  navCars:'العربيات',navAbout:'عن ELVN',navVisit:'زور المعرض',talk:'تواصل معانا ↗',location:'القاهرة الجديدة · مصر',headline:'رحلتك الجاية.<br>بأسلوبك إنت.',intro:'في عربيات بتوصّلك.<br>وعربيات بتخلّي كل مشوار حكاية.',explore:'اكتشف ELVN',scroll:'اكتشف المزيد ↓',photoNote:'صورة تعبيرية · ليست من مخزون المعرض',collectionLabel:'اكتشف العربيات',collectionTitle:'بداية جديدة.<br>وعربية تليق بيك.',collectionIntro:'بتدور على عربية معينة؟ قولنا اللي في بالك، وفريقنا يساعدك تعرف المتاح.',inventoryLabel:'خلّينا نلاقي عربيتك الجاية',inventoryTitle:'العربية المناسبة<br>بتبدأ بكلام بينا.',inventoryCopy:'تواصل مع فريقنا لمعرفة أحدث العربيات المتاحة والمواصفات والأسعار.',availability:'اسأل عن العربيات المتاحة ↗',worldLabel:'عالم ELVN',worldTitle:'أكتر من عربية.<br>تعبير عن شخصيتك.',worldCopy:'أهلًا بيك في ELVN Motors. معرضنا في القاهرة الجديدة هو مكانك لاكتشاف عربيتك الجاية والكلام عن كل التفاصيل اللي تهمك.',worldCopy2:'من أول سؤال لحد زيارتك للمعرض، فريقنا على تواصل مباشر معاك. رحلتك الجاية بتبدأ هنا.',meet:'مستنيينك في القاهرة الجديدة ↗',stepsLabel:'خطوتك الجاية',step1:'قولنا اللي في بالك.',step1Copy:'موديل معين، ستايل مختلف، أو بداية جديدة. عرّفنا إنت بتدور على إيه.',step2:'اعرف كل التفاصيل.',step2Copy:'اسأل فريقنا عن العربيات المتاحة ومواصفاتها وأسعارها الحالية.',step3:'زورنا في المعرض.',step3Copy:'اعرف الطريق، نسّق زيارتك، وشوف عربيتك الجاية بنفسك.',visitLabel:'مستنيين زيارتك',visitTitle:'شوفها.<br>حسّها. سوقها.',address:'شارع 27، القاهرة الجديدة، القاهرة، مصر',whatsapp:'كلّمنا على واتساب',directions:'الطريق للمعرض ↗',mapLocation:'القاهرة الجديدة، مصر',footerTagline:'Drive luxury.<br>خليك قريب مننا.',rights:'جميع الحقوق محفوظة.'
};
const originals = new Map();
document.querySelectorAll('[data-i18n]').forEach(element => originals.set(element, element.innerHTML));
let language = 'en';
try { language = localStorage.getItem('elvn-language') === 'ar' ? 'ar' : 'en'; } catch {}
function setLanguage(next) {
  language = next;
  document.documentElement.lang = next;
  document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  originals.forEach((original, element) => { element.innerHTML = next === 'ar' ? translations[element.dataset.i18n] || original : original; });
  document.getElementById('language').textContent = next === 'ar' ? 'English' : 'العربية';
  document.getElementById('language').setAttribute('aria-label', next === 'ar' ? 'Switch to English' : 'التبديل للعربية');
  try { localStorage.setItem('elvn-language', next); } catch {}
  renderCars();
}
document.getElementById('language').addEventListener('click', () => setLanguage(language === 'en' ? 'ar' : 'en'));
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('directions').href = document.querySelector('.location-card').href;
let cars = [];
function renderCars() {
  const container = document.getElementById('inventory');
  container.replaceChildren();
  document.getElementById('inventory-empty').hidden = cars.length > 0;
  for (const car of cars) {
    const article = document.createElement('article'); article.className = 'car-card';
    const img = document.createElement('img'); img.src = car.image; img.alt = car.title; img.loading = 'lazy';
    const title = document.createElement('h3'); title.textContent = car.title;
    const details = document.createElement('p'); details.textContent = language === 'ar' && car.detailsAr ? car.detailsAr : car.details;
    const link = document.createElement('a'); link.className = 'text-link'; link.textContent = language === 'ar' ? 'اسأل عن العربية ↗' : 'Enquire about this car ↗'; link.href = 'https://wa.me/201110596555?text=' + encodeURIComponent('Hello ELVN Motors, I am interested in ' + car.title); link.target = '_blank'; link.rel = 'noopener';
    article.append(img, title, details, link); container.append(article);
  }
}
setLanguage(language);
fetch('data/cars.json').then(response => { if (!response.ok) throw new Error('Inventory unavailable'); return response.json(); }).then(data => { cars = Array.isArray(data) ? data.filter(car => car && typeof car.title === 'string' && typeof car.image === 'string' && car.available !== false) : []; renderCars(); }).catch(() => { cars = []; renderCars(); });
