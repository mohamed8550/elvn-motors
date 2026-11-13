const translations = {
  navCars:'العربيات',navAbout:'عن ELVN',navVisit:'زور المعرض',talk:'تواصل معانا ↗',location:'القاهرة الجديدة · مصر',headline:'رحلتك الجاية.<br>بأسلوبك إنت.',intro:'في عربيات بتوصّلك.<br>وعربيات بتخلّي كل مشوار حكاية.',explore:'اكتشف ELVN',scroll:'اكتشف المزيد ↓',photoNote:'صورة تعبيرية · ليست من مخزون المعرض',collectionLabel:'اكتشف العربيات',collectionTitle:'بداية جديدة.<br>وعربية تليق بيك.',collectionIntro:'بتدور على عربية معينة؟ قولنا اللي في بالك، وفريقنا يساعدك تعرف المتاح.',inventoryLabel:'خلّينا نلاقي عربيتك الجاية',inventoryTitle:'العربية المناسبة<br>بتبدأ بكلام بينا.',inventoryCopy:'تواصل مع فريقنا لمعرفة أحدث العربيات المتاحة والمواصفات والأسعار.',availability:'اسأل عن العربيات المتاحة ↗',worldLabel:'عالم ELVN',worldTitle:'أكتر من عربية.<br>تعبير عن شخصيتك.',worldCopy:'أهلًا بيك في ELVN Motors. معرضنا في القاهرة الجديدة هو مكانك لاكتشاف عربيتك الجاية والكلام عن كل التفاصيل اللي تهمك.',worldCopy2:'من أول سؤال لحد زيارتك للمعرض، فريقنا على تواصل مباشر معاك. رحلتك الجاية بتبدأ هنا.',meet:'مستنيينك في القاهرة الجديدة ↗',stepsLabel:'خطوتك الجاية',step1:'قولنا اللي في بالك.',step1Copy:'موديل معين، ستايل مختلف، أو بداية جديدة. عرّفنا إنت بتدور على إيه.',step2:'اعرف كل التفاصيل.',step2Copy:'اسأل فريقنا عن العربيات المتاحة ومواصفاتها وأسعارها الحالية.',step3:'زورنا في المعرض.',step3Copy:'اعرف الطريق، نسّق زيارتك، وشوف عربيتك الجاية بنفسك.',visitLabel:'مستنيين زيارتك',visitTitle:'شوفها.<br>حسّها. سوقها.',address:'شارع 27، القاهرة الجديدة، القاهرة، مصر',whatsapp:'كلّمنا على واتساب',directions:'الطريق للمعرض ↗',mapLocation:'القاهرة الجديدة، مصر',footerTagline:'Drive luxury.<br>خليك قريب مننا.',rights:'جميع الحقوق محفوظة.'
};
Object.assign(translations, {inventoryHint: "اكتشف العربيات المتاحة", collectionTitle: "عربياتنا المتاحة.", collectionIntro: "اختار عربيتك، شوف أهم التجهيزات، وتواصل معانا لمعرفة التفاصيل."});
Object.assign(translations, {worldTitle: "سرّ القاهرة الجديدة<br>الأجمل.", worldCopy: "سيارات استثنائية. ومكان له طابعه الخاص.", worldCopy2: "أهلًا بك في ELVN Motors — معرض مستقل في القاهرة الجديدة، نستورد فيه كل سيارة بأنفسنا. تجربة بطابع شخصي لاختيار سيارتك القادمة.", meet: "اكتشف ELVN ↗"});
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
const inventoryTrack = document.getElementById('inventory');
const inventoryPrevious = document.getElementById('inventory-prev');
const inventoryNext = document.getElementById('inventory-next');
function updateInventoryControls() {
  const cards = [...inventoryTrack.children];
  const rtl = document.documentElement.dir === 'rtl';
  const track = inventoryTrack.getBoundingClientRect();
  const first = cards[0]?.getBoundingClientRect();
  const last = cards.at(-1)?.getBoundingClientRect();
  inventoryPrevious.disabled = !first || (rtl ? first.right <= track.right + 2 : first.left >= track.left - 2);
  inventoryNext.disabled = !last || (rtl ? last.left >= track.left - 2 : last.right <= track.right + 2);
}
function moveInventory(direction) {
  inventoryTrack.scrollBy({left: direction * (document.documentElement.dir === 'rtl' ? -1 : 1) * ((inventoryTrack.firstElementChild?.offsetWidth || 380) + 24), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}
function renderCars() {
  const container = document.getElementById('inventory');
  container.replaceChildren();
  document.getElementById('inventory-empty').hidden = cars.length > 0;
  document.getElementById('inventory-controls').hidden = cars.length === 0;
  for (const car of cars) {
    const ar = language === 'ar';
    const article = document.createElement('article'); article.className = 'car-card'; article.dataset.carId = car.legacyId || car.id;
    const detailUrl = 'cars/' + car.id.toLowerCase().split(' ').join('-') + '/';
    const imageWrap = document.createElement('a'); imageWrap.className = 'car-image'; imageWrap.href = detailUrl; imageWrap.setAttribute('aria-label', 'View ' + car.title + ' ' + car.color);
    const img = document.createElement('img'); img.src = car.image; img.alt = `${car.title} ${car.year}`; img.loading = 'lazy'; img.width = 3072; img.height = 4096;
    const badge = document.createElement('span'); badge.className = 'car-badge'; badge.textContent = ar ? 'متاحة الآن' : 'AVAILABLE NOW';
    imageWrap.append(img, badge);
    const body = document.createElement('div'); body.className = 'car-body';
    const make = document.createElement('p'); make.className = 'car-make'; make.textContent = 'MERCEDES-BENZ';
    const title = document.createElement('h3'); const titleLink = document.createElement('a'); titleLink.href = detailUrl; titleLink.textContent = car.title.replace('Mercedes-Benz ', ''); title.append(titleLink);
    const specs = document.createElement('div'); specs.className = 'car-specs';
    for (const [label, value] of [[ar ? 'الموديل' : 'MODEL YEAR', String(car.year)], [ar ? 'الكيلومترات' : 'MILEAGE', new Intl.NumberFormat('en').format(car.mileage) + (ar ? ' كم' : ' KM')]]) {
      const item = document.createElement('div'); const small = document.createElement('span'); small.textContent = label; const strong = document.createElement('strong'); strong.textContent = value; item.append(small, strong); specs.append(item);
    }
    const features = document.createElement('ul'); features.className = 'car-features';
    for (const feature of (ar ? car.featuresAr || car.features : car.features) || []) { const li = document.createElement('li'); li.textContent = feature; features.append(li); }
    const price = document.createElement('p'); price.className = 'car-price'; price.textContent = (ar ? '' : 'EGP ') + new Intl.NumberFormat('en').format(car.price) + (ar ? ' جنيه' : '');
    const link = document.createElement('a'); link.className = 'car-enquire'; link.textContent = ar ? 'استفسر عن العربية ↗' : 'Enquire about this car ↗'; link.href = 'https://wa.me/201110596555?text=' + encodeURIComponent(`Hello ELVN Motors, I am interested in ${car.title} ${car.year} (${car.color}).`); link.target = '_blank'; link.rel = 'noopener';
    const color = document.createElement("p"); color.className = "car-color"; color.textContent = ar ? car.colorAr || car.color : car.color;
    const detailsLink = document.createElement('a'); detailsLink.className = 'car-details'; detailsLink.href = detailUrl; detailsLink.textContent = ar ? 'الصور والتفاصيل ↗' : 'View photos & details ↗';
    body.append(make, title, color, specs, features, price, detailsLink, link); article.append(imageWrap, body); container.append(article);
  }
  requestAnimationFrame(updateInventoryControls);
}
setLanguage(language);
inventoryPrevious.addEventListener('click', () => moveInventory(-1));
inventoryNext.addEventListener('click', () => moveInventory(1));
inventoryTrack.addEventListener('scroll', updateInventoryControls, {passive:true});
window.addEventListener('resize', updateInventoryControls);
inventoryTrack.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); moveInventory((event.key === 'ArrowRight' ? 1 : -1) * (document.documentElement.dir === 'rtl' ? -1 : 1)); } });
fetch('data/cars.json?v=internal-ids-1').then(response => { if (!response.ok) throw new Error('Inventory unavailable'); return response.json(); }).then(data => { cars = Array.isArray(data) ? data.filter(car => car && typeof car.title === 'string' && typeof car.image === 'string' && car.available !== false) : []; renderCars(); }).catch(() => { cars = []; renderCars(); });
