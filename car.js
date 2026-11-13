const $ = id => document.getElementById(id);
const words = {en:{back:'← Back to collection',available:'Available now',hint:'Swipe to explore · Click photograph to enlarge',price:'ASKING PRICE',enquire:'Enquire on WhatsApp ↗',note:'Imported directly by ELVN Motors. Visit our showroom in New Cairo.',equipmentLabel:'THE DETAILS',equipment:'Features & equipment'},ar:{back:'العودة للعربيات ←',available:'متاحة الآن',hint:'اسحب لتقليب الصور · اضغط على الصورة للتكبير',price:'السعر',enquire:'استفسر على واتساب ↗',note:'مستوردة مباشرة بمعرفة ELVN Motors. زور معرضنا في القاهرة الجديدة.',equipmentLabel:'التفاصيل',equipment:'المواصفات والتجهيزات'}};
let lang = 'en'; try {lang = localStorage.getItem('elvn-language') === 'ar' ? 'ar' : 'en';} catch {}
let car, photos = [], current = 0;
const labels = ['Front three-quarter view','Front view','Exterior detail','Headlight detail','Rear detail','Rear view','Wheel detail','Interior detail','Vehicle detail'];
function showPhoto(index, focusThumb = false) {
  current = (index + photos.length) % photos.length;
  for (const id of ['main-photo','full-photo']) {$(id).src = photos[current]; $(id).alt = `${car.title} · ${car.color} · photograph ${current + 1} of ${photos.length}`;}
  const count = `${String(current + 1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  $('counter').textContent = count; $('full-counter').textContent = count;
  [...$('thumbnails').children].forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
  if(focusThumb) $('thumbnails').children[current]?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});
}
function render() {
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $('language').textContent = lang === 'ar' ? 'English' : 'العربية';
  document.querySelectorAll('[data-copy]').forEach(element => element.textContent = words[lang][element.dataset.copy]);
  if(!car) return;
  const ar = lang === 'ar', number = new Intl.NumberFormat('en');
  document.title = `${car.title} ${car.year} — ${car.color} | ELVN Motors`;
  $('car-title').textContent = car.title;
  $('car-subtitle').textContent = `${car.year} · ${ar ? car.colorAr : car.color} · ${number.format(car.mileage)} ${ar ? 'كم' : 'KM'}`;
  $('car-price').textContent = ar ? `${number.format(car.price)} جنيه` : `EGP ${number.format(car.price)}`;
  $('specifications').replaceChildren();
  for(const [label,value] of [[ar?'الموديل':'Model year',car.year],[ar?'الكيلومترات':'Mileage',`${number.format(car.mileage)} ${ar?'كم':'KM'}`],[ar?'اللون':'Exterior colour',ar?car.colorAr:car.color]]) {
    const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; row.append(dt,dd); $('specifications').append(row);
  }
  $('equipment').replaceChildren();
  for(const item of (ar ? car.fullFeaturesAr || car.featuresAr : car.fullFeatures || car.features)) {const li = document.createElement('li'); li.textContent = item; $('equipment').append(li);}
  $('enquiry').href = 'https://wa.me/201110596555?text=' + encodeURIComponent(`Hello ELVN Motors, I am interested in ${car.title} ${car.year}, ${car.color}, ${number.format(car.mileage)} KM (${car.id}).`);
}
$('language').addEventListener('click', () => {lang = lang === 'en' ? 'ar' : 'en'; try {localStorage.setItem('elvn-language',lang);} catch {} render();});
for(const id of ['previous','lightbox-prev']) $(id).addEventListener('click',()=>showPhoto(current-1,true));
for(const id of ['next','lightbox-next']) $(id).addEventListener('click',()=>showPhoto(current+1,true));
$('enlarge').addEventListener('click',()=>{$('lightbox').showModal(); document.body.classList.add('viewer-open');});
$('close-viewer').addEventListener('click',()=>$('lightbox').close());
$('lightbox').addEventListener('close',()=>document.body.classList.remove('viewer-open'));
document.addEventListener('keydown',event=>{if(!car || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showPhoto(current+(event.key==='ArrowRight'?1:-1),!$('lightbox').open);}});
for(const surface of [document.querySelector('.photo-stage'),$('full-photo')]) {let start;surface.addEventListener('touchstart',e=>{start={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});surface.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))showPhoto(current+(dx<0?1:-1),!$('lightbox').open);start=null;},{passive:true});}
render();
fetch('data/cars.json?v=white-cover-1').then(r=>{if(!r.ok)throw Error('Inventory unavailable');return r.json();}).then(cars=>{
  const id = new URLSearchParams(location.search).get('id'); car = cars.find(item=>item.id===id&&item.available!==false); if(!car)throw Error('Vehicle unavailable');
  photos = car.gallery?.length ? car.gallery : [car.image];
  photos.forEach((src,i)=>{const button=document.createElement('button'),img=document.createElement('img');button.type='button';button.setAttribute('aria-label',`View photograph ${i+1}`);img.src=src;img.alt=`${car.color} ${car.title} — photograph ${i+1}`;img.loading='lazy';button.append(img);button.addEventListener('click',()=>showPhoto(i));$('thumbnails').append(button);});
  for(const id of ['previous','next','lightbox-prev','lightbox-next']) $(id).hidden=photos.length<2;
  $('status').hidden=true;$('vehicle').hidden=false;render();showPhoto(0);
}).catch(()=>{$('status').textContent=lang==='ar'?'تعذر تحميل العربية. ارجع لقائمة العربيات أو تواصل معنا.':'This vehicle could not be loaded. Return to the collection or contact our team.';});
