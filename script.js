/* =====================================================
   ★ 여기만 수정하면 됩니다: 장소 데이터 ★
   - x, y : 지도 위 버튼 위치 (지도 왼쪽 위가 0%, 오른쪽 아래가 100%)
   - photos : 사진 파일 경로와 설명 (images 폴더에 사진을 넣으세요)
   - example : true 이면 "예시 데이터" 표시가 나타납니다. 실제 결과면 false
   - 장소를 추가하려면 { ... }, 블록을 복사해서 붙여 넣으세요.
   ===================================================== */
const places = [
  {
    id: "office",
    name: "교무실",
    x: 17, y: 25,
    target: "책상 표면, 출입문 손잡이",
    date: "2025-00-00",
    photos: [
      { src: "images/office-1.jpg", caption: "책상 표면 (배양 48시간)" },
      { src: "images/office-2.jpg", caption: "문 손잡이 (배양 48시간)" }
    ],
    observation: "(예시) 흰색의 둥근 집락이 여러 개 관찰됨. 가장자리는 매끈함.",
    note: "(예시) 종류는 확인되지 않았습니다. 외형 관찰만 기록했습니다.",
    example: true
  },
  {
    id: "class11",
    name: "1학년 1반",
    x: 41, y: 25,
    target: "교탁, 칠판 지우개",
    date: "2025-00-00",
    photos: [{ src: "images/class11-1.jpg", caption: "교탁 (배양 48시간)" }],
    observation: "(예시) 노란색 집락과 작은 흰색 집락이 섞여 있음.",
    note: "(예시) 아직 확정되지 않은 예시 정보입니다.",
    example: true
  },
  {
    id: "class12",
    name: "1학년 2반",
    x: 63, y: 25,
    target: "사물함 손잡이",
    date: "2025-00-00",
    photos: [],
    observation: "(예시) 아직 배양 중입니다.",
    note: "(예시) 사진이 없으면 '사진 준비 중'으로 표시됩니다.",
    example: true
  },
  {
    id: "health",
    name: "보건실",
    x: 85, y: 25,
    target: "침대 난간, 문 손잡이",
    date: "2025-00-00",
    photos: [{ src: "images/health-1.jpg", caption: "침대 난간" }],
    observation: "(예시) 집락 수가 적고 크기가 작음.",
    note: "(예시) 확정되지 않은 예시 정보입니다.",
    example: true
  },
  {
    id: "entrance",
    name: "현관",
    x: 17, y: 75,
    target: "신발장 손잡이",
    date: "2025-00-00",
    photos: [{ src: "images/entrance-1.jpg", caption: "신발장 손잡이" }],
    observation: "(예시) 색과 모양이 다양한 집락이 관찰됨.",
    note: "(예시) 확정되지 않은 예시 정보입니다.",
    example: true
  },
  {
    id: "toilet",
    name: "화장실",
    x: 41, y: 75,
    target: "수도꼭지",
    date: "2025-00-00",
    photos: [{ src: "images/toilet-1.jpg", caption: "수도꼭지" }],
    observation: "(예시) 분홍빛 집락이 관찰됨.",
    note: "(예시) 확정되지 않은 예시 정보입니다.",
    example: true
  }
];

/* ===== 아래는 기능 코드입니다 (보통 수정하지 않아도 됩니다) ===== */
const $ = (id) => document.getElementById(id);
const mapWrap = $("map-wrap");

// 1) 장소마다 지도 위에 버튼 만들기
places.forEach((place) => {
  const btn = document.createElement("button");
  btn.className = "spot";
  btn.textContent = place.name;
  btn.style.left = place.x + "%";   // % 위치라서 지도 크기가 변해도 어긋나지 않음
  btn.style.top = place.y + "%";
  btn.dataset.id = place.id;
  btn.addEventListener("click", () => showPlace(place));
  mapWrap.appendChild(btn);
});

// 2) 장소 정보 보여 주기
function showPlace(place) {
  $("info-empty").hidden = true;
  $("info-content").hidden = false;
  $("info-name").textContent = place.name;
  $("info-example").hidden = !place.example;
  $("info-target").textContent = place.target;
  $("info-date").textContent = place.date;
  $("info-observation").textContent = place.observation;
  $("info-note").textContent = place.note;

  // 선택된 버튼 색 바꾸기
  document.querySelectorAll(".spot").forEach((b) =>
    b.classList.toggle("active", b.dataset.id === place.id));

  // 사진 목록 만들기
  const box = $("info-photos");
  box.innerHTML = "";
  if (place.photos.length === 0) box.appendChild(missingBox());
  place.photos.forEach((p) => {
    const fig = document.createElement("figure");
    const img = document.createElement("img");
    img.src = p.src;
    img.alt = place.name + " 배양 사진: " + p.caption;
    img.addEventListener("click", () => openLightbox(p));
    // 사진 파일이 없거나 경로가 틀리면 '사진 준비 중' 칸으로 바꿈
    img.addEventListener("error", () => img.replaceWith(missingBox()));
    const cap = document.createElement("figcaption");
    cap.textContent = p.caption;
    fig.append(img, cap);
    box.appendChild(fig);
  });

  // 모바일에서는 정보 패널로 자동 이동
  if (window.innerWidth <= 800) $("info-panel").scrollIntoView({ behavior: "smooth" });
}

function missingBox() {
  const d = document.createElement("div");
  d.className = "photo-missing";
  d.textContent = "사진 준비 중";
  return d;
}

// 3) 닫기 버튼
$("close-btn").addEventListener("click", () => {
  $("info-content").hidden = true;
  $("info-empty").hidden = false;
  document.querySelectorAll(".spot").forEach((b) => b.classList.remove("active"));
});

// 4) 사진 확대 / 닫기 (아무 곳이나 누르면 닫힘, Esc 키도 가능)
function openLightbox(p) {
  $("lightbox-img").src = p.src;
  $("lightbox-caption").textContent = p.caption;
  $("lightbox").hidden = false;
}
$("lightbox").addEventListener("click", () => ($("lightbox").hidden = true));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("lightbox").hidden = true; });

// 5) 지도 이미지가 없을 때 안내
$("map-img").addEventListener("error", () => {
  $("map-img").replaceWith(Object.assign(document.createElement("p"),
    { textContent: "지도 이미지를 찾을 수 없습니다. images 폴더와 파일 이름을 확인하세요.", style: "padding:40px" }));
});
