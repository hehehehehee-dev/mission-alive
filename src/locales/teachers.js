// Exact rendered text-node keys for the teacher guide and all five printable resources.
// Keep scientific names, standards codes, answer letters, and numeric answers unchanged.
const entries = [
  [
    "FOR TEACHERS · CLASSROOM GUIDE",
    "PARA DOCENTES · GUÍA PARA EL AULA",
    "DÀNH CHO GIÁO VIÊN · HƯỚNG DẪN TRÊN LỚP"
  ],
  [
    "Bring four NASA machines",
    "Lleva cuatro máquinas de la NASA",
    "Đưa bốn cỗ máy của NASA"
  ],
  [
    "into your classroom.",
    "a tu aula.",
    "vào lớp học của bạn."
  ],
  [
    "Mission Alive is a free, browser-based interactive space academy where Curiosity, Ingenuity, Webb, and Voyager 1 tell their own stories — and your students help finish their missions.",
    "Mission Alive es una academia espacial interactiva, gratuita y accesible desde el navegador, donde Curiosity, Ingenuity, Webb y Voyager 1 cuentan sus propias historias, y tus estudiantes les ayudan a completar sus misiones.",
    "Mission Alive là học viện không gian tương tác miễn phí trên trình duyệt, nơi Curiosity, Ingenuity, Webb và Voyager 1 tự kể câu chuyện của mình — và học sinh giúp chúng hoàn thành nhiệm vụ."
  ],
  [
    "Enter the academy",
    "Entrar en la academia",
    "Vào học viện"
  ],
  [
    "Print the teacher pack ↓",
    "Imprimir el paquete docente ↓",
    "In bộ tài liệu giáo viên ↓"
  ],
  [
    "At a glance",
    "De un vistazo",
    "Thông tin nhanh"
  ],
  [
    "Ages 10–14",
    "Edades: 10–14 años",
    "Độ tuổi 10–14"
  ],
  [
    "Grades 5–9",
    "Grados 5–9 (sistema estadounidense)",
    "Lớp 5–9 (hệ Mỹ)"
  ],
  [
    "Full visit ≈ one class period",
    "Visita completa ≈ una clase",
    "Toàn bộ hành trình ≈ một tiết học"
  ],
  [
    "No accounts",
    "Sin cuentas",
    "Không cần tài khoản"
  ],
  [
    "Private by default",
    "Privado por defecto",
    "Mặc định giữ riêng tư"
  ],
  [
    "60-SECOND FIT CHECK",
    "COMPRUEBA EN 60 SEGUNDOS SI ENCAJA",
    "TÌM HIỂU TRONG 60 GIÂY"
  ],
  [
    "Full visit",
    "Visita completa",
    "Toàn bộ hành trình"
  ],
  [
    "40–50 minutes (one class period)",
    "40–50 minutos (una clase)",
    "40–50 phút (một tiết học)"
  ],
  [
    "Single exhibit",
    "Un solo módulo",
    "Một mô-đun"
  ],
  [
    "8–12 minutes — assign one as homework or a bell-ringer",
    "8–12 minutos: asígnalo como tarea o actividad de inicio",
    "8–12 phút — giao làm bài tập về nhà hoặc hoạt động đầu giờ"
  ],
  [
    "Devices",
    "Dispositivos",
    "Thiết bị"
  ],
  [
    "Any modern browser. Works on school Chromebooks and tablets; also runs whole-class from one projector",
    "Cualquier navegador moderno. Funciona en Chromebooks y tabletas escolares; también permite trabajar con toda la clase usando un proyector",
    "Mọi trình duyệt hiện đại. Dùng được trên Chromebook và máy tính bảng của trường; cũng có thể chiếu cho cả lớp cùng tham gia"
  ],
  [
    "Cost",
    "Costo",
    "Chi phí"
  ],
  [
    "Free",
    "Gratis",
    "Miễn phí"
  ],
  [
    "Accounts",
    "Cuentas",
    "Tài khoản"
  ],
  [
    "None — for teachers or students",
    "No se necesitan, ni para docentes ni para estudiantes",
    "Không cần — với cả giáo viên và học sinh"
  ],
  [
    "Student data",
    "Datos del alumnado",
    "Dữ liệu học sinh"
  ],
  [
    "No server collection by default. Certification stamps and private greetings stay on the device. Students can explicitly submit a greeting to a classroom record; the teacher must approve it before public listening.",
    "Por defecto no se recopilan datos en el servidor. Los sellos de certificación y los saludos privados permanecen en el dispositivo. Los estudiantes pueden enviar expresamente un saludo a un disco de clase; el docente debe aprobarlo antes de que pueda escucharse públicamente.",
    "Mặc định không thu thập dữ liệu trên máy chủ. Dấu chứng nhận và lời chào riêng tư được lưu trên thiết bị. Học sinh có thể chủ động gửi lời chào vào đĩa của lớp; giáo viên phải duyệt trước khi lời chào được nghe công khai."
  ],
  [
    "Internet",
    "Internet",
    "Internet"
  ],
  [
    "Needed for live Voyager distance and classroom records",
    "Se necesita para la distancia en vivo de Voyager y los discos de clase",
    "Cần cho khoảng cách Voyager cập nhật trực tiếp và đĩa của lớp"
  ],
  [
    "Reading level",
    "Nivel de lectura",
    "Mức độ đọc hiểu"
  ],
  [
    "Written for ages 10–14; every exhibit opens with the machine speaking in first person",
    "Escrito para edades de 10–14 años; cada módulo comienza con la máquina hablando en primera persona",
    "Nội dung dành cho độ tuổi 10–14; mỗi mô-đun mở đầu bằng lời kể ngôi thứ nhất của cỗ máy"
  ],
  [
    "FLEXIBLE BY DESIGN",
    "FLEXIBLE DESDE EL DISEÑO",
    "LINH HOẠT CHO TỪNG LỚP HỌC"
  ],
  [
    "Four ways to run the visit",
    "Cuatro formas de organizar la visita",
    "Bốn cách tổ chức hành trình"
  ],
  [
    "MODE A · 35–45 MIN",
    "MODO A · 35–45 MIN",
    "CÁCH A · 35–45 PHÚT"
  ],
  [
    "Whole-class guided visit",
    "Visita guiada con toda la clase",
    "Cả lớp khám phá có hướng dẫn"
  ],
  [
    "You drive, the class decides. At each challenge — Curiosity's driving program, Ingenuity's preflight checklist, Webb's alignment, Voyager's record — take a class vote before acting. Best for introducing a new unit.",
    "Tú manejas y la clase decide. En cada desafío —el programa de conducción de Curiosity, la lista previa al vuelo de Ingenuity, la alineación de Webb y el disco de Voyager—, somete la decisión a votación antes de actuar. Ideal para presentar una nueva unidad.",
    "Giáo viên thao tác, cả lớp quyết định. Ở mỗi thử thách — chương trình lái Curiosity, danh sách kiểm tra trước chuyến bay của Ingenuity, căn chỉnh Webb, đĩa Voyager — hãy cho lớp biểu quyết trước khi thực hiện. Phù hợp để mở đầu một chủ đề mới."
  ],
  [
    "MODE B · 40–50 MIN",
    "MODO B · 40–50 MIN",
    "CÁCH B · 40–50 PHÚT"
  ],
  [
    "Self-paced exploration",
    "Exploración al propio ritmo",
    "Tự khám phá theo nhịp độ riêng"
  ],
  [
    "Students explore in any order and collect all four certification stamps. You circulate with the discussion questions below. Students who finish early get the extension prompts.",
    "Los estudiantes exploran en cualquier orden y reúnen los cuatro sellos de certificación. Tú recorres el aula con las preguntas de discusión de abajo. Quienes terminan antes reciben las actividades de ampliación.",
    "Học sinh khám phá theo thứ tự tùy chọn và thu thập đủ bốn dấu chứng nhận. Giáo viên đi quanh lớp với các câu hỏi thảo luận bên dưới. Học sinh hoàn thành sớm có thể làm hoạt động mở rộng."
  ],
  [
    "MODE C · 4 × ~10 MIN",
    "MODO C · 4 × ~10 MIN",
    "CÁCH C · 4 × ~10 PHÚT"
  ],
  [
    "Station rotation",
    "Rotación por estaciones",
    "Luân phiên theo trạm"
  ],
  [
    "Four groups, four devices, one exhibit per station. At each rotation, the group must earn the stamp before moving on. The printable certification sheet tracks it on paper if devices are shared.",
    "Cuatro grupos, cuatro dispositivos y un módulo por estación. En cada rotación, el grupo debe obtener el sello antes de continuar. Si se comparten dispositivos, la hoja de certificación imprimible permite registrar el progreso en papel.",
    "Bốn nhóm, bốn thiết bị, mỗi trạm một mô-đun. Mỗi lượt, nhóm phải giành được dấu trước khi chuyển trạm. Nếu dùng chung thiết bị, phiếu chứng nhận in được giúp ghi lại tiến trình trên giấy."
  ],
  [
    "MODE D · 15–20 MIN",
    "MODO D · 15–20 MIN",
    "CÁCH D · 15–20 PHÚT"
  ],
  [
    "Flipped or homework",
    "Aula invertida o tarea en casa",
    "Lớp học đảo ngược hoặc bài tập về nhà"
  ],
  [
    "Assign one exhibit plus its reflection question the night before a lesson. Start the lesson with the “After” discussion questions. Works because each exhibit is self-contained.",
    "Asigna un módulo y su pregunta de reflexión la noche anterior a la clase. Empieza la lección con las preguntas de discusión de «Después». Funciona porque cada módulo es independiente.",
    "Giao một mô-đun kèm câu hỏi suy ngẫm vào tối trước buổi học. Mở đầu tiết học bằng các câu hỏi thảo luận ở phần “Sau”. Mỗi mô-đun có nội dung độc lập nên có thể học riêng."
  ],
  [
    "ONE-CLASS FLOW",
    "SECUENCIA PARA UNA CLASE",
    "TIẾN TRÌNH MỘT TIẾT HỌC"
  ],
  [
    "Before · During · After",
    "Antes · Durante · Después",
    "Trước · Trong · Sau"
  ],
  [
    "01 · 5 MIN",
    "01 · 5 MIN",
    "01 · 5 PHÚT"
  ],
  [
    "Before",
    "Antes",
    "Trước"
  ],
  [
    "Print the certification worksheet. Pick one exhibit and ask its “Before” question cold — no wrong answers, you're surfacing what students think they know. Optional: KWL chart (Know / Want to know / Learned).",
    "Imprime la hoja de certificación. Elige un módulo y plantea su pregunta de «Antes» sin preparación: no hay respuestas incorrectas, buscas conocer lo que los estudiantes creen saber. Opcional: tabla KWL (Sé / Quiero saber / Aprendí).",
    "In phiếu chứng nhận. Chọn một mô-đun và hỏi câu “Trước” khi học sinh chưa chuẩn bị — không có câu trả lời sai; mục đích là tìm hiểu các em nghĩ mình đã biết gì. Tùy chọn: bảng KWL (Đã biết / Muốn biết / Đã học)."
  ],
  [
    "02 · EXPLORE",
    "02 · EXPLORAR",
    "02 · KHÁM PHÁ"
  ],
  [
    "During",
    "Durante",
    "Trong"
  ],
  [
    "Students earn certification stamps by completing each exhibit's mission challenge. Your checkpoints: the misconceptions in the exhibit guides — listen for them as students talk, they're the teachable moments.",
    "Los estudiantes obtienen sellos de certificación al completar el desafío de misión de cada módulo. Tus puntos de observación: las ideas equivocadas de las guías. Escucha si aparecen cuando los estudiantes conversan; son oportunidades para aprender.",
    "Học sinh nhận dấu chứng nhận khi hoàn thành thử thách nhiệm vụ của mỗi mô-đun. Điều giáo viên cần chú ý là những ngộ nhận trong hướng dẫn: lắng nghe khi học sinh trao đổi để nhận ra cơ hội giải thích và giúp các em hiểu đúng."
  ],
  [
    "03 · 10 MIN",
    "03 · 10 MIN",
    "03 · 10 PHÚT"
  ],
  [
    "After",
    "Después",
    "Sau"
  ],
  [
    "3-2-1 exit ticket:",
    "Boleto de salida 3-2-1:",
    "Phiếu cuối giờ 3-2-1:"
  ],
  [
    "3",
    "3",
    "3"
  ],
  [
    "facts you learned,",
    "datos que aprendiste,",
    "điều em đã học được,"
  ],
  [
    "2",
    "2",
    "2"
  ],
  [
    "questions you still have,",
    "preguntas que aún tienes,",
    "câu hỏi em vẫn còn,"
  ],
  [
    "1",
    "1",
    "1"
  ],
  [
    "machine you'd want to meet. Then one “After” discussion question as a whole class.",
    "máquina que te gustaría conocer. Después, una pregunta de «Después» para debatir con toda la clase.",
    "cỗ máy em muốn gặp. Sau đó, cả lớp thảo luận một câu hỏi ở phần “Sau”."
  ],
  [
    "EXHIBIT-BY-EXHIBIT",
    "MÓDULO POR MÓDULO",
    "HƯỚNG DẪN TỪNG MÔ-ĐUN"
  ],
  [
    "Teaching guides",
    "Guías docentes",
    "Hướng dẫn giảng dạy"
  ],
  [
    "Open a guide for its hook, goals, core science, standards, misconception checks, discussion prompts, vocabulary, and a fast-finisher task.",
    "Abre una guía para ver su frase inicial, objetivos, ciencia esencial, estándares, ideas equivocadas, preguntas de discusión, vocabulario y una actividad para quienes terminan antes.",
    "Mở hướng dẫn để xem câu dẫn mở đầu, mục tiêu, kiến thức khoa học, chuẩn học tập, ngộ nhận cần kiểm tra, câu hỏi thảo luận, từ vựng và bài tập cho học sinh hoàn thành sớm."
  ],
  [
    "01",
    "01",
    "01"
  ],
  [
    "10–12 min",
    "10–12 min",
    "10–12 phút"
  ],
  [
    "Curiosity — Roving Science Laboratory",
    "Curiosity — Laboratorio científico móvil",
    "Curiosity — Phòng thí nghiệm khoa học di động"
  ],
  [
    "“Every move I make was planned on Earth hours ago. Then I go alone.”",
    "«Cada movimiento que hago se planificó en la Tierra hace horas. Después, avanzo por mi cuenta».",
    "“Mỗi bước di chuyển của tôi đã được lên kế hoạch trên Trái Đất từ nhiều giờ trước. Sau đó, tôi tự lên đường.”"
  ],
  [
    "+",
    "+",
    "+"
  ],
  [
    "What students do",
    "Qué hacen los estudiantes",
    "Học sinh làm gì"
  ],
  [
    "Explore the rover's instruments in 3D, then write a block program to reach an outcrop, drill, analyze the powder, and choose a report supported by the evidence. The final decision distinguishes possible habitability from a claim that life was found.",
    "Exploran los instrumentos del rover en 3D y después crean un programa por bloques para llegar a un afloramiento, perforar, analizar el polvo y elegir un informe respaldado por las pruebas. La decisión final distingue la posible habitabilidad de una afirmación de que se encontró vida.",
    "Khám phá thiết bị của xe tự hành ở chế độ 3D, rồi lập trình bằng khối lệnh để đến chỗ đá lộ thiên, khoan, phân tích bột đá và chọn báo cáo dựa trên bằng chứng. Quyết định cuối cùng giúp phân biệt điều kiện có thể hỗ trợ sự sống với khẳng định đã tìm thấy sự sống."
  ],
  [
    "Learning goals",
    "Objetivos de aprendizaje",
    "Mục tiêu học tập"
  ],
  [
    "Distinguish evidence of habitability from evidence of life (Curiosity found the first, not the second).",
    "Distinguir las pruebas de habitabilidad de las pruebas de vida (Curiosity encontró las primeras, no las segundas).",
    "Phân biệt bằng chứng về khả năng hỗ trợ sự sống với bằng chứng về sự sống (Curiosity tìm thấy loại đầu tiên, không phải loại thứ hai)."
  ],
  [
    "Explain why rovers are programmed in advance instead of driven live (signal delay).",
    "Explicar por qué los rovers se programan con antelación en vez de conducirse en directo (retraso de la señal).",
    "Giải thích vì sao xe tự hành được lập trình trước thay vì điều khiển trực tiếp (độ trễ tín hiệu)."
  ],
  [
    "Describe how the rover identifies, samples, and chemically analyzes rock.",
    "Describir cómo el rover identifica, toma muestras y analiza químicamente las rocas.",
    "Mô tả cách xe tự hành nhận diện, lấy mẫu và phân tích hóa học của đá."
  ],
  [
    "Core science",
    "Ciencia esencial",
    "Kiến thức khoa học cốt lõi"
  ],
  [
    "Gale Crater and its layered history · Mastcam imaging · drill sampling · SAM and CheMin onboard chemistry labs · radioisotope (nuclear) power and why it suits Mars · algorithms as sequenced commands with loops.",
    "El cráter Gale y la historia de sus capas · imágenes de Mastcam · toma de muestras con taladro · laboratorios químicos SAM y CheMin a bordo · energía de radioisótopos (nuclear) y por qué resulta adecuada para Marte · algoritmos como secuencias de instrucciones con bucles.",
    "Hố va chạm Gale và lịch sử trong các lớp đá · chụp ảnh bằng Mastcam · khoan lấy mẫu · phòng thí nghiệm hóa học SAM và CheMin trên xe · năng lượng đồng vị phóng xạ (hạt nhân) và lý do phù hợp với sao Hỏa · thuật toán gồm chuỗi lệnh có vòng lặp."
  ],
  [
    "Standards",
    "Estándares",
    "Chuẩn học tập"
  ],
  [
    "NGSS MS-ESS1-3 (analyze data to determine scale properties of solar system objects) · MS-ESS2-2 (evidence for how surface processes change a landscape over time — applied to Mars strata; see note in the standards map) · MS-ETS1-4 (iterative testing and modification of a design — the programming challenge).",
    "NGSS MS-ESS1-3 (analizar datos para determinar propiedades de escala de los objetos del sistema solar) · MS-ESS2-2 (pruebas de cómo los procesos superficiales cambian el paisaje con el tiempo; aplicado a los estratos de Marte, véase la nota en el mapa de estándares) · MS-ETS1-4 (pruebas y modificaciones sucesivas de un diseño: el desafío de programación).",
    "NGSS MS-ESS1-3 (phân tích dữ liệu để xác định đặc điểm quy mô của các thiên thể trong Hệ Mặt Trời) · MS-ESS2-2 (bằng chứng về cách các quá trình bề mặt làm thay đổi cảnh quan theo thời gian — áp dụng cho địa tầng sao Hỏa; xem ghi chú trong bảng chuẩn học tập) · MS-ETS1-4 (thử nghiệm và điều chỉnh thiết kế nhiều lần — thử thách lập trình)."
  ],
  [
    "MISCONCEPTION ALERT",
    "ALERTA DE IDEA EQUIVOCADA",
    "LƯU Ý VỀ NGỘ NHẬN"
  ],
  [
    "“Curiosity found aliens.” It did not. It found evidence that ancient Gale Crater had conditions suitable for microbial life — liquid water, chemistry, energy sources. Habitability ≠ inhabitants. Second misconception: “NASA drives it with a joystick.” Signal delay makes that impossible; engineers upload command sequences — exactly what students do in the challenge.",
    "«Curiosity encontró extraterrestres». No fue así. Encontró pruebas de que el antiguo cráter Gale tenía condiciones adecuadas para la vida microbiana: agua líquida, sustancias químicas y fuentes de energía. Habitabilidad ≠ habitantes. Otra idea equivocada: «La NASA lo conduce con un joystick». El retraso de la señal lo impide; los ingenieros cargan secuencias de instrucciones, exactamente lo que hacen los estudiantes en el desafío.",
    "“Curiosity tìm thấy người ngoài hành tinh.” Không phải vậy. Nó tìm thấy bằng chứng rằng hố Gale thời xa xưa có điều kiện phù hợp cho vi sinh vật — nước lỏng, thành phần hóa học và nguồn năng lượng. Có thể hỗ trợ sự sống ≠ có sinh vật sống. Ngộ nhận thứ hai: “NASA lái xe bằng cần điều khiển.” Độ trễ tín hiệu khiến việc đó không khả thi; kỹ sư gửi các chuỗi lệnh — đúng như học sinh làm trong thử thách."
  ],
  [
    "Discussion questions",
    "Preguntas de discusión",
    "Câu hỏi thảo luận"
  ],
  [
    "What would count as proof that a place could have supported life — without finding life itself?",
    "¿Qué demostraría que un lugar pudo albergar vida, sin encontrar vida en sí?",
    "Điều gì có thể chứng minh một nơi từng có khả năng hỗ trợ sự sống — ngay cả khi chưa tìm thấy sự sống?"
  ],
  [
    "Why can't engineers just drive Curiosity the way you'd drive a remote-control car?",
    "¿Por qué los ingenieros no pueden conducir Curiosity como un coche teledirigido?",
    "Vì sao kỹ sư không thể lái Curiosity như em lái xe điều khiển từ xa?"
  ],
  [
    "Curiosity analyzed rock powder and found the ingredients for life. What did it not find — and why does that distinction matter to scientists?",
    "Curiosity analizó polvo de roca y encontró ingredientes para la vida. ¿Qué no encontró y por qué es importante esa diferencia para la ciencia?",
    "Curiosity phân tích bột đá và tìm thấy các thành phần cần cho sự sống. Nó chưa tìm thấy gì — và vì sao sự khác biệt đó quan trọng với các nhà khoa học?"
  ],
  [
    "Vocabulary",
    "Vocabulario",
    "Từ vựng"
  ],
  [
    "Gale Crater",
    "cráter Gale",
    "hố va chạm Gale"
  ],
  [
    "the ancient impact crater Curiosity explores",
    "el antiguo cráter de impacto que explora Curiosity",
    "hố va chạm cổ mà Curiosity đang khám phá"
  ],
  [
    "outcrop",
    "afloramiento",
    "đá lộ thiên"
  ],
  [
    "rock exposed at the surface",
    "roca expuesta en la superficie",
    "đá lộ ra trên bề mặt"
  ],
  [
    "sample",
    "muestra",
    "mẫu vật"
  ],
  [
    "material collected for testing",
    "material recogido para analizarlo",
    "vật liệu được thu thập để kiểm tra"
  ],
  [
    "habitability",
    "habitabilidad",
    "khả năng hỗ trợ sự sống"
  ],
  [
    "whether conditions could support life",
    "si las condiciones podrían albergar vida",
    "liệu các điều kiện có thể hỗ trợ sự sống hay không"
  ],
  [
    "RTG",
    "RTG",
    "RTG"
  ],
  [
    "nuclear power source that runs the rover day and night",
    "fuente de energía nuclear que hace funcionar el rover de día y de noche",
    "nguồn năng lượng hạt nhân giúp xe hoạt động cả ngày lẫn đêm"
  ],
  [
    "FAST FINISHERS",
    "PARA QUIENES TERMINAN ANTES",
    "DÀNH CHO HỌC SINH HOÀN THÀNH SỚM"
  ],
  [
    "“Curiosity's challenge lets you program up to 11 blocks. Find the shortest program that still completes the mission. What did the loops save you?”",
    "«El desafío de Curiosity permite programar hasta 11 bloques. Encuentra el programa más corto que complete la misión. ¿Qué te ahorraron los bucles?»",
    "“Thử thách Curiosity cho phép lập trình tối đa 11 khối lệnh. Hãy tìm chương trình ngắn nhất vẫn hoàn thành nhiệm vụ. Vòng lặp đã giúp em tiết kiệm gì?”"
  ],
  [
    "02",
    "02",
    "02"
  ],
  [
    "8–10 min",
    "8–10 min",
    "8–10 phút"
  ],
  [
    "Ingenuity — Mars Flight Demonstrator",
    "Ingenuity — Demostrador de vuelo en Marte",
    "Ingenuity — Thiết bị thử nghiệm bay trên sao Hỏa"
  ],
  [
    "“I was built to attempt up to five flights. I flew seventy-two.”",
    "«Me construyeron para intentar hasta cinco vuelos. Volé setenta y dos veces».",
    "“Tôi được chế tạo để thử thực hiện tối đa năm chuyến bay. Tôi đã bay bảy mươi hai chuyến.”"
  ],
  [
    "Choose an onboard flight controller, test the radio link, then choose a landing site, set rotor power, and simulate wind corrections. The flight log records what failed at touchdown so students can revise the next plan quickly.",
    "Eligen un controlador de vuelo a bordo, prueban el enlace de radio y después escogen una zona de aterrizaje, ajustan la potencia de los rotores y simulan correcciones por viento. El registro de vuelo indica qué falló al tocar tierra para poder revisar rápidamente el siguiente plan.",
    "Chọn bộ điều khiển bay trên máy, kiểm tra liên lạc vô tuyến, rồi chọn bãi đáp, đặt công suất rotor và mô phỏng điều chỉnh khi có gió. Nhật ký bay ghi lại lỗi lúc tiếp đất để học sinh nhanh chóng cải tiến kế hoạch tiếp theo."
  ],
  [
    "Explain why flying on Mars is hard despite weaker gravity (air ~1% as dense as Earth's — almost nothing for rotors to push against).",
    "Explicar por qué volar en Marte es difícil pese a su menor gravedad (el aire tiene ~1 % de la densidad del terrestre: los rotores apenas tienen aire que empujar).",
    "Giải thích vì sao bay trên sao Hỏa khó dù trọng lực yếu hơn (mật độ không khí chỉ khoảng 1% so với Trái Đất — rotor gần như không có không khí để đẩy)."
  ],
  [
    "Explain why Ingenuity had to fly itself autonomously (radio delay to Mars).",
    "Explicar por qué Ingenuity tenía que volar de forma autónoma (retraso de las comunicaciones de radio con Marte).",
    "Giải thích vì sao Ingenuity phải tự bay (độ trễ liên lạc vô tuyến với sao Hỏa)."
  ],
  [
    "Explain the value of a technology demonstration: Ingenuity was built to attempt up to 5 flights and completed 72.",
    "Explicar el valor de una demostración tecnológica: Ingenuity se construyó para intentar hasta 5 vuelos y completó 72.",
    "Giải thích giá trị của thử nghiệm công nghệ: Ingenuity được chế tạo để thử tối đa 5 chuyến bay nhưng đã hoàn thành 72 chuyến."
  ],
  [
    "Lift and rotor speed in thin air · counter-rotating rotors canceling torque · autonomous flight vs. remote control · solar power and cold survival · how demo missions de-risk future ones (rotorcraft are now candidates for future Mars exploration).",
    "Sustentación y velocidad de los rotores en aire tenue · rotores que giran en sentidos opuestos para contrarrestar el par de torsión · vuelo autónomo frente a control remoto · energía solar y supervivencia al frío · cómo las misiones de demostración reducen riesgos para las futuras (las aeronaves de rotores ya se consideran para explorar Marte).",
    "Lực nâng và tốc độ rotor trong không khí loãng · các rotor quay ngược chiều triệt tiêu mô-men xoắn · bay tự chủ so với điều khiển từ xa · năng lượng mặt trời và sống sót trong giá lạnh · nhiệm vụ thử nghiệm giúp giảm rủi ro cho nhiệm vụ sau (thiết bị bay rotor hiện là ứng viên cho việc khám phá sao Hỏa trong tương lai)."
  ],
  [
    "NGSS MS-PS2-2 (change in motion depends on forces and mass — lift vs. gravity) · MS-ETS1-3 (analyze test data to identify improvements — 72 flights of iteration).",
    "NGSS MS-PS2-2 (los cambios de movimiento dependen de las fuerzas y la masa: sustentación frente a gravedad) · MS-ETS1-3 (analizar datos de pruebas para identificar mejoras: 72 vuelos de ajustes sucesivos).",
    "NGSS MS-PS2-2 (thay đổi chuyển động phụ thuộc vào lực và khối lượng — lực nâng và trọng lực) · MS-ETS1-3 (phân tích dữ liệu thử nghiệm để tìm cách cải tiến — 72 chuyến bay thử và điều chỉnh)."
  ],
  [
    "“Lower gravity makes flying easy.” Gravity is not the hard part — the air is. Ingenuity's rotors spun many times faster than an Earth helicopter's just to bite into Mars's thin atmosphere. Second: “It sent photos back live.” Nothing from Mars is live; every command and image crosses minutes of delay.",
    "«Una gravedad menor facilita volar». La dificultad no es la gravedad, sino el aire. Los rotores de Ingenuity giraban mucho más rápido que los de un helicóptero terrestre para poder impulsarse en la tenue atmósfera marciana. Otra: «Enviaba fotos en directo». Nada que llegue de Marte es en directo; cada instrucción e imagen tarda minutos en viajar.",
    "“Trọng lực yếu hơn khiến việc bay dễ dàng.” Khó khăn nằm ở không khí, không phải trọng lực. Rotor của Ingenuity quay nhanh gấp nhiều lần trực thăng trên Trái Đất để tạo lực trong khí quyển sao Hỏa loãng. Ngộ nhận thứ hai: “Nó truyền ảnh trực tiếp.” Không có gì từ sao Hỏa đến ngay lập tức; mỗi lệnh và hình ảnh đều mất nhiều phút để truyền."
  ],
  [
    "Gravity on Mars is weaker than on Earth. So why would flying there be harder, not easier?",
    "La gravedad en Marte es menor que en la Tierra. Entonces, ¿por qué sería más difícil volar allí en vez de más fácil?",
    "Trọng lực trên sao Hỏa yếu hơn trên Trái Đất. Vậy vì sao bay ở đó lại khó hơn thay vì dễ hơn?"
  ],
  [
    "Ingenuity can't wait for instructions from Earth mid-flight. What does it have to decide on its own?",
    "Ingenuity no puede esperar instrucciones de la Tierra durante el vuelo. ¿Qué debe decidir por sí mismo?",
    "Ingenuity không thể chờ lệnh từ Trái Đất khi đang bay. Nó phải tự quyết định những gì?"
  ],
  [
    "Engineers planned up to 5 demonstration flights and got 72. What does a demo that overperforms make possible next?",
    "Los ingenieros planearon hasta 5 vuelos de demostración y consiguieron 72. ¿Qué posibilidades abre una demostración que supera las expectativas?",
    "Kỹ sư dự kiến tối đa 5 chuyến bay thử nhưng đạt được 72 chuyến. Một thử nghiệm vượt kỳ vọng có thể mở ra những khả năng nào tiếp theo?"
  ],
  [
    "Jezero Crater",
    "cráter Jezero",
    "hố va chạm Jezero"
  ],
  [
    "Ingenuity's flying field on Mars",
    "el campo de vuelo de Ingenuity en Marte",
    "khu vực bay của Ingenuity trên sao Hỏa"
  ],
  [
    "demonstrator",
    "demostrador",
    "thiết bị thử nghiệm công nghệ"
  ],
  [
    "a test vehicle built to prove an idea works",
    "un vehículo de prueba construido para demostrar que una idea funciona",
    "phương tiện thử nghiệm được chế tạo để chứng minh một ý tưởng hoạt động được"
  ],
  [
    "torque",
    "par de torsión",
    "mô-men xoắn"
  ],
  [
    "twisting force; opposite-spinning rotors cancel it",
    "fuerza de giro; los rotores que giran en sentidos opuestos la contrarrestan",
    "tác dụng làm vật quay; các rotor quay ngược chiều giúp triệt tiêu tác dụng này"
  ],
  [
    "autonomous",
    "autónomo",
    "tự chủ"
  ],
  [
    "deciding without outside control",
    "que decide sin control externo",
    "tự quyết định mà không cần điều khiển từ bên ngoài"
  ],
  [
    "rotor",
    "rotor",
    "rotor"
  ],
  [
    "the spinning blade that creates lift",
    "la pala giratoria que genera sustentación",
    "cánh quay tạo ra lực nâng"
  ],
  [
    "“Ingenuity's final flight was January 18, 2024, after a rotor was damaged. If you were designing its successor, what one thing would you change — and what trade-off would that create?”",
    "«El último vuelo de Ingenuity fue el 18 de enero de 2024, tras sufrir daños en un rotor. Si diseñaras su sucesor, ¿qué cambiarías y qué desventaja supondría ese cambio?»",
    "“Chuyến bay cuối của Ingenuity diễn ra ngày 18 tháng 1 năm 2024, sau khi một rotor bị hỏng. Nếu thiết kế thế hệ tiếp theo, em sẽ thay đổi điều gì — và phải đánh đổi điều gì vì thay đổi đó?”"
  ],
  [
    "03",
    "03",
    "03"
  ],
  [
    "10 min",
    "10 min",
    "10 phút"
  ],
  [
    "Webb — Folding Space Observatory",
    "Webb — Observatorio espacial plegable",
    "Webb — Đài quan sát không gian có thể gập"
  ],
  [
    "“My mirror is wider than the rocket that carried me. So I learned to fold.”",
    "«Mi espejo es más ancho que el cohete que me transportó. Así que aprendí a plegarme».",
    "“Gương của tôi rộng hơn tên lửa đã đưa tôi lên không gian. Vì thế tôi học cách gập lại.”"
  ],
  [
    "Unfold Webb's two mirror wings, align three star images, then shift an illustrated scene from visible light toward infrared to reveal a region hidden by dust.",
    "Despliegan las dos alas del espejo de Webb, alinean tres imágenes de estrellas y después desplazan una escena ilustrada de la luz visible hacia el infrarrojo para revelar una región oculta por el polvo.",
    "Mở hai cánh gương của Webb, căn chỉnh ba ảnh sao, rồi chuyển một khung cảnh minh họa từ ánh sáng nhìn thấy sang hồng ngoại để làm lộ vùng bị bụi che khuất."
  ],
  [
    "Explain why Webb's mirror had to fold (6.5 m mirror, ~5 m rocket fairing) and what unfolding made possible.",
    "Explicar por qué el espejo de Webb tuvo que plegarse (espejo de 6,5 m, carenado del cohete de ~5 m) y qué hizo posible desplegarlo.",
    "Giải thích vì sao gương Webb phải gập lại (gương 6,5 m, khoang chụp bảo vệ của tên lửa khoảng 5 m) và việc mở gương cho phép làm gì."
  ],
  [
    "Distinguish deploying the mirror from aligning it — 18 segments behaving as one.",
    "Distinguir el despliegue del espejo de su alineación: 18 segmentos que actúan como uno solo.",
    "Phân biệt mở gương với căn chỉnh gương — để 18 mảnh hoạt động như một gương duy nhất."
  ],
  [
    "Explain why Webb observes infrared light, and why distant galaxies appear shifted into it.",
    "Explicar por qué Webb observa luz infrarroja y por qué la luz de galaxias lejanas se desplaza hacia ella.",
    "Giải thích vì sao Webb quan sát ánh sáng hồng ngoại và vì sao ánh sáng từ các thiên hà xa bị dịch về vùng hồng ngoại."
  ],
  [
    "Infrared astronomy and the expanding universe (redshift) · why looking far away is looking back in time · segmented mirrors and actuators (each segment moves in steps smaller than a wavelength of light) · the five-layer sunshield and why Webb must stay colder than −220 °C · launch packaging as an engineering constraint.",
    "Astronomía infrarroja y expansión del universo (corrimiento al rojo) · por qué mirar lejos es mirar al pasado · espejos segmentados y actuadores (cada segmento se mueve en pasos menores que una longitud de onda de la luz) · el parasol de cinco capas y por qué Webb debe mantenerse por debajo de −220 °C · las dimensiones de lanzamiento como restricción de ingeniería.",
    "Thiên văn hồng ngoại và vũ trụ giãn nở (dịch chuyển đỏ) · vì sao nhìn xa là nhìn về quá khứ · gương ghép mảnh và bộ truyền động (mỗi mảnh di chuyển từng bước nhỏ hơn một bước sóng ánh sáng) · tấm chắn nắng năm lớp và lý do Webb phải lạnh dưới −220 °C · giới hạn kích thước khi phóng là một ràng buộc kỹ thuật."
  ],
  [
    "NGSS MS-PS4-2 (waves are reflected, absorbed, transmitted — mirrors and light) · MS-ETS1-4 (iterative alignment process) · supports HS-ESS1-2 discussions at the upper end (origin/expansion of the universe).",
    "NGSS MS-PS4-2 (las ondas se reflejan, absorben y transmiten: espejos y luz) · MS-ETS1-4 (proceso de alineación mediante ajustes sucesivos) · apoya debates de HS-ESS1-2 para estudiantes de mayor nivel (origen y expansión del universo).",
    "NGSS MS-PS4-2 (sóng bị phản xạ, hấp thụ và truyền qua — gương và ánh sáng) · MS-ETS1-4 (quá trình căn chỉnh qua nhiều lần điều chỉnh) · hỗ trợ thảo luận HS-ESS1-2 ở mức học cao hơn (nguồn gốc/sự giãn nở của vũ trụ)."
  ],
  [
    "“Webb sees like a camera.” It sees heat-light — infrared our eyes can't detect, which is why its images are assigned visible colors. Two more: “Webb replaced Hubble” (they observe different light and often work together), and the classic: “Looking at distant galaxies means looking back in time” — that one is true. Teach it: the light arriving now left billions of years ago.",
    "«Webb ve como una cámara». Detecta radiación térmica: infrarrojo que nuestros ojos no pueden ver; por eso a sus imágenes se les asignan colores visibles. Otras dos: «Webb sustituyó a Hubble» (observan tipos de luz distintos y a menudo trabajan juntos) y «Mirar galaxias lejanas es mirar al pasado»: esta última sí es cierta. Explícalo: la luz que llega ahora salió hace miles de millones de años.",
    "“Webb nhìn như máy ảnh.” Nó nhìn thấy bức xạ nhiệt — ánh sáng hồng ngoại mắt người không thấy được, nên ảnh của nó được gán màu nhìn thấy. Hai ý nữa: “Webb thay thế Hubble” (chúng quan sát các loại ánh sáng khác nhau và thường phối hợp), và “Nhìn các thiên hà xa là nhìn về quá khứ” — điều này đúng. Hãy giải thích: ánh sáng đến hôm nay đã rời nguồn từ hàng tỷ năm trước."
  ],
  [
    "Why would a telescope need to fold like origami — and what could go wrong?",
    "¿Por qué un telescopio tendría que plegarse como una figura de origami y qué podría salir mal?",
    "Vì sao kính thiên văn cần gập như origami — và điều gì có thể trục trặc?"
  ],
  [
    "Unfolding the mirror and aligning it are different jobs. What's the difference?",
    "Desplegar el espejo y alinearlo son tareas diferentes. ¿En qué se distinguen?",
    "Mở gương và căn chỉnh gương là hai việc khác nhau. Khác nhau ở đâu?"
  ],
  [
    "Webb's first sharp image took months of alignment. Why can't the segments just be built perfectly in the first place?",
    "La primera imagen nítida de Webb requirió meses de alineación. ¿Por qué no se pueden fabricar los segmentos perfectamente desde el principio?",
    "Webb mất nhiều tháng căn chỉnh để có ảnh sắc nét đầu tiên. Vì sao không thể chế tạo các mảnh gương hoàn hảo ngay từ đầu?"
  ],
  [
    "segment",
    "segmento",
    "mảnh gương"
  ],
  [
    "one of 18 hexagonal mirror pieces",
    "una de las 18 piezas hexagonales del espejo",
    "một trong 18 mảnh gương hình lục giác"
  ],
  [
    "actuator",
    "actuador",
    "bộ truyền động"
  ],
  [
    "a tiny motor that nudges a segment into place",
    "un motor diminuto que ajusta la posición de un segmento",
    "động cơ tí hon điều chỉnh mảnh gương vào đúng vị trí"
  ],
  [
    "sunshield",
    "parasol",
    "tấm chắn nắng"
  ],
  [
    "five layers that block heat from the Sun, Earth, and Moon",
    "cinco capas que bloquean el calor del Sol, la Tierra y la Luna",
    "năm lớp chắn nhiệt từ Mặt Trời, Trái Đất và Mặt Trăng"
  ],
  [
    "infrared",
    "infrarrojo",
    "hồng ngoại"
  ],
  [
    "light just beyond red, invisible to eyes",
    "luz más allá del rojo que nuestros ojos no ven",
    "ánh sáng nằm ngay ngoài vùng đỏ, mắt người không nhìn thấy"
  ],
  [
    "redshift",
    "corrimiento al rojo",
    "dịch chuyển đỏ"
  ],
  [
    "distant galaxies' light stretched toward infrared as the universe expands",
    "la luz de galaxias lejanas se estira hacia el infrarrojo a medida que el universo se expande",
    "ánh sáng từ các thiên hà xa bị kéo giãn về vùng hồng ngoại khi vũ trụ giãn nở"
  ],
  [
    "“A human hair is about 100,000 nanometers wide. Webb's segments were aligned to within a fraction of a wavelength of light. Find out how many nanometers that is — and compare.”",
    "«Un cabello humano mide unos 100.000 nanómetros de ancho. Los segmentos de Webb se alinearon con una precisión de una fracción de la longitud de onda de la luz. Averigua cuántos nanómetros son y compara».",
    "“Một sợi tóc người rộng khoảng 100.000 nanomét. Các mảnh gương Webb được căn chỉnh với độ chính xác chỉ bằng một phần bước sóng ánh sáng. Hãy tìm hiểu con số đó là bao nhiêu nanomét — rồi so sánh.”"
  ],
  [
    "04",
    "04",
    "04"
  ],
  [
    "Voyager 1 — Interstellar Messenger",
    "Voyager 1 — Mensajero interestelar",
    "Voyager 1 — Sứ giả giữa các vì sao"
  ],
  [
    "“I am the farthest thing humans have ever made. When I whisper home, my voice takes almost a full day to arrive.”",
    "«Soy el objeto creado por la humanidad que ha llegado más lejos. Cuando susurro hacia casa, mi voz tarda casi un día entero en llegar».",
    "“Tôi là vật thể do con người tạo ra đã đi xa nhất. Khi tôi thì thầm về nhà, giọng nói của tôi mất gần trọn một ngày mới đến nơi.”"
  ],
  [
    "Explore the Golden Record, listen to one of its 55 greetings, and record or write a private greeting to earn the stamp. A microphone is optional. An optional signal lab compares the Moon, 1 AU, and Voyager 1 through one-way radio travel time and Moon-distance multiples, using JPL Horizons when available.",
    "Exploran el Disco de Oro, escuchan uno de sus 55 saludos y graban o escriben un saludo privado para conseguir el sello. El micrófono es opcional. Un laboratorio de señales opcional compara la Luna, 1 UA y Voyager 1 mediante el tiempo de viaje de radio en un sentido y múltiplos de la distancia a la Luna, usando JPL Horizons cuando está disponible.",
    "Khám phá Đĩa Vàng, nghe một trong 55 lời chào và ghi âm hoặc viết lời chào riêng tư để nhận dấu. Không bắt buộc dùng micro. Phòng thí nghiệm tín hiệu tùy chọn so sánh Mặt Trăng, 1 AU và Voyager 1 theo thời gian truyền sóng vô tuyến một chiều và bội số khoảng cách đến Mặt Trăng, dùng JPL Horizons khi có thể."
  ],
  [
    "Use astronomical units and light-time to describe solar-system scale (Voyager 1 is ~160+ AU away; its signal takes roughly a day, one way — the live number is on screen).",
    "Usar unidades astronómicas y tiempo de viaje de la luz para describir la escala del sistema solar (Voyager 1 está a más de ~160 UA; su señal tarda aproximadamente un día en un sentido: la cifra en vivo aparece en pantalla).",
    "Dùng đơn vị thiên văn và thời gian ánh sáng truyền để mô tả quy mô Hệ Mặt Trời (Voyager 1 cách khoảng hơn 160 AU; tín hiệu mất gần một ngày để đi một chiều — số cập nhật trực tiếp được hiển thị trên màn hình)."
  ],
  [
    "Explain the Golden Record's purpose: a time capsule and message, designed to be playable by whoever finds it.",
    "Explicar el propósito del Disco de Oro: una cápsula del tiempo y un mensaje, diseñados para que quien lo encuentre pueda reproducirlo.",
    "Giải thích mục đích của Đĩa Vàng: một hộp lưu giữ ký ức và thông điệp, được thiết kế để bất cứ ai tìm thấy cũng có thể phát lại."
  ],
  [
    "Explain how the pulsar map encodes “where home is” for a finder who shares nothing with us.",
    "Explicar cómo el mapa de púlsares codifica «dónde está nuestro hogar» para alguien que no comparte nada con nosotros.",
    "Giải thích cách bản đồ sao xung mã hóa “nhà ở đâu” cho người tìm thấy không có điểm chung nào với chúng ta."
  ],
  [
    "Scale of the solar system (AU, light-time) · the heliopause and interstellar space (crossed in 2012) · deep-space communication (the received signal is billions of times weaker than a digital watch battery, arriving ~24 h late) · finite power — Voyager's nuclear generators produce less power each year, so instruments are being switched off one by one · the Record: 55 languages, 90 minutes of music, 115 images.",
    "Escala del sistema solar (UA, tiempo de viaje de la luz) · la heliopausa y el espacio interestelar (cruzada en 2012) · comunicación en el espacio profundo (la señal recibida es miles de millones de veces más débil que la batería de un reloj digital y llega con ~24 h de retraso) · energía limitada: los generadores nucleares de Voyager producen menos energía cada año, por lo que los instrumentos se apagan uno a uno · el Disco: 55 idiomas, 90 minutos de música y 115 imágenes.",
    "Quy mô Hệ Mặt Trời (AU, thời gian ánh sáng truyền) · nhật mãn và không gian liên sao (vượt qua năm 2012) · liên lạc không gian sâu (tín hiệu nhận được yếu hơn năng lượng từ pin đồng hồ điện tử hàng tỷ lần, đến trễ khoảng 24 giờ) · năng lượng hữu hạn — máy phát hạt nhân của Voyager tạo ít điện hơn mỗi năm nên thiết bị lần lượt được tắt · Đĩa Vàng: 55 ngôn ngữ, 90 phút nhạc, 115 hình ảnh."
  ],
  [
    "NGSS MS-ESS1-3 (scale properties of the solar system — the strongest fit among these training modules) · MS-PS4-3 (digitized signals as a reliable way to encode and transmit information — the Record and deep-space link).",
    "NGSS MS-ESS1-3 (propiedades de escala del sistema solar: la correspondencia más clara entre estos módulos) · MS-PS4-3 (señales digitalizadas como forma fiable de codificar y transmitir información: el Disco y el enlace con el espacio profundo).",
    "NGSS MS-ESS1-3 (đặc điểm quy mô Hệ Mặt Trời — phù hợp nhất trong các mô-đun này) · MS-PS4-3 (tín hiệu số là cách mã hóa và truyền thông tin đáng tin cậy — Đĩa Vàng và liên lạc không gian sâu)."
  ],
  [
    "“Voyager has left the solar system.” Depends on the definition — it crossed the heliopause in 2012 and is in interstellar space, but the Sun's gravity and the Oort cloud extend far beyond it. Second: “We can talk to Voyager like a phone call.” One-way light time is nearly a full day; a round trip takes almost two. Have students check the live number — it changes daily.",
    "«Voyager ha salido del sistema solar». Depende de la definición: cruzó la heliopausa en 2012 y está en el espacio interestelar, pero la gravedad del Sol y la nube de Oort se extienden mucho más allá. Otra: «Podemos hablar con Voyager como por teléfono». La luz tarda casi un día entero en un sentido; el viaje de ida y vuelta tarda casi dos. Pide al alumnado que consulte la cifra en vivo: cambia a diario.",
    "“Voyager đã rời Hệ Mặt Trời.” Còn tùy định nghĩa — nó vượt qua nhật mãn năm 2012 và ở trong không gian liên sao, nhưng lực hấp dẫn Mặt Trời và đám mây Oort còn vươn xa hơn nhiều. Ngộ nhận thứ hai: “Có thể nói chuyện với Voyager như gọi điện.” Tín hiệu mất gần trọn một ngày đi một chiều; cả đi lẫn về mất gần hai ngày. Cho học sinh kiểm tra số trực tiếp — nó thay đổi mỗi ngày."
  ],
  [
    "If you could send one sound into space, to be found a billion years from now, what would you choose?",
    "Si pudieras enviar un sonido al espacio para que alguien lo encontrara dentro de mil millones de años, ¿cuál elegirías?",
    "Nếu có thể gửi một âm thanh vào không gian để ai đó tìm thấy sau một tỷ năm nữa, em sẽ chọn âm thanh nào?"
  ],
  [
    "The greetings are recorded in 55 languages. Why send so many — and what can a recording say that words on a page can't?",
    "Los saludos están grabados en 55 idiomas. ¿Por qué enviar tantos y qué puede expresar una grabación que no pueden las palabras escritas?",
    "Các lời chào được ghi bằng 55 ngôn ngữ. Vì sao gửi nhiều đến vậy — và bản ghi âm có thể truyền đạt điều gì mà chữ trên giấy không thể?"
  ],
  [
    "As Voyager's instruments gradually fall silent, the spacecraft will keep traveling for billions of years. What is it for, once it can no longer talk to us?",
    "Mientras los instrumentos de Voyager se van silenciando, la nave seguirá viajando miles de millones de años. ¿Para qué sirve una vez que ya no pueda hablar con nosotros?",
    "Khi các thiết bị Voyager dần im tiếng, con tàu vẫn tiếp tục đi hàng tỷ năm. Nó còn ý nghĩa gì khi không thể nói chuyện với chúng ta nữa?"
  ],
  [
    "AU (astronomical unit)",
    "UA (unidad astronómica)",
    "AU (đơn vị thiên văn)"
  ],
  [
    "Earth's average distance from the Sun, ≈150 million km",
    "la distancia media de la Tierra al Sol, ≈150 millones de km",
    "khoảng cách trung bình từ Trái Đất đến Mặt Trời, ≈150 triệu km"
  ],
  [
    "light-time",
    "tiempo de viaje de la luz",
    "thời gian ánh sáng truyền"
  ],
  [
    "how long a signal takes to travel a distance",
    "cuánto tarda una señal en recorrer una distancia",
    "thời gian một tín hiệu cần để đi hết một khoảng cách"
  ],
  [
    "heliopause",
    "heliopausa",
    "nhật mãn"
  ],
  [
    "the boundary where the Sun's wind gives way to interstellar space",
    "el límite donde el viento solar cede el paso al espacio interestelar",
    "ranh giới nơi gió Mặt Trời nhường chỗ cho không gian liên sao"
  ],
  [
    "interstellar",
    "interestelar",
    "liên sao"
  ],
  [
    "between the stars",
    "entre las estrellas",
    "giữa các vì sao"
  ],
  [
    "pulsar map",
    "mapa de púlsares",
    "bản đồ sao xung"
  ],
  [
    "a diagram using flashing stars as landmarks to locate our Sun",
    "un diagrama que usa estrellas pulsantes como puntos de referencia para localizar nuestro Sol",
    "sơ đồ dùng các sao phát xung làm mốc để xác định vị trí Mặt Trời của chúng ta"
  ],
  [
    "“Voyager's distance on this page is live. Using its speed, calculate how much farther away it will be by your next birthday. Show your units.”",
    "«La distancia de Voyager en esta página se actualiza en vivo. Usa su velocidad para calcular cuánto más lejos estará en tu próximo cumpleaños. Indica las unidades».",
    "“Khoảng cách Voyager trên trang này được cập nhật trực tiếp. Dùng tốc độ của nó để tính xem đến sinh nhật tới của em nó sẽ đi xa thêm bao nhiêu. Nhớ ghi đơn vị.”"
  ],
  [
    "A YEAR-LONG TIME CAPSULE",
    "UNA CÁPSULA DEL TIEMPO PARA TODO EL CURSO",
    "HỘP KÝ ỨC CHO CẢ NĂM HỌC"
  ],
  [
    "Make a Golden Record for your class",
    "Crea un Disco de Oro para tu clase",
    "Tạo Đĩa Vàng cho lớp của bạn"
  ],
  [
    "In Voyager's recording studio, create a record named for your class. Give students the 12-character class code. They can add a short audio or written greeting in their home language, plus an English translation. You review each one before it appears in the public classroom gallery. Revisit the record at the end of the year and compare how far each greeting would have traveled at Voyager 1's speed.",
    "En el estudio de grabación de Voyager, crea un disco con el nombre de tu clase. Da a los estudiantes el código de clase de 12 caracteres. Podrán añadir un breve saludo grabado o escrito en su lengua materna, junto con una traducción al inglés. Tú revisas cada uno antes de que aparezca en la galería pública de la clase. Vuelvan a escucharlo a final de curso y comparen cuánto habría viajado cada saludo a la velocidad de Voyager 1.",
    "Trong phòng thu Voyager, tạo một đĩa mang tên lớp. Cho học sinh mã lớp gồm 12 ký tự. Các em có thể thêm lời chào ngắn bằng âm thanh hoặc văn bản bằng tiếng mẹ đẻ, kèm bản dịch tiếng Anh. Giáo viên duyệt từng lời chào trước khi chúng xuất hiện trong bộ sưu tập công khai của lớp. Cuối năm, cùng xem lại đĩa và so sánh quãng đường mỗi lời chào có thể đã đi với tốc độ Voyager 1."
  ],
  [
    "Save your private teacher key outside the browser; the class code alone cannot approve submissions. Students need no account, and a microphone is optional. Use a class title and nicknames that do not identify students.",
    "Guarda tu clave privada docente fuera del navegador; el código de clase por sí solo no permite aprobar envíos. Los estudiantes no necesitan cuenta y el micrófono es opcional. Usa un nombre de clase y apodos que no permitan identificar a los estudiantes.",
    "Lưu khóa giáo viên riêng tư ở ngoài trình duyệt; chỉ có mã lớp thì không thể duyệt lời chào. Học sinh không cần tài khoản và không bắt buộc dùng micro. Đặt tên lớp và biệt danh không làm lộ danh tính học sinh."
  ],
  [
    "Open Voyager's classroom studio →",
    "Abrir el estudio de clase de Voyager →",
    "Mở phòng thu lớp học của Voyager →"
  ],
  [
    "ZERO-PREP HANDOUTS",
    "FICHAS LISTAS PARA USAR",
    "PHIẾU HỌC TẬP DÙNG NGAY"
  ],
  [
    "Printable resources",
    "Recursos imprimibles",
    "Tài liệu in được"
  ],
  [
    "Print the complete pack or choose one resource. Print layouts use clean black text on white paper.",
    "Imprime todo el paquete o elige un recurso. Los diseños de impresión usan texto negro y claro sobre papel blanco.",
    "In cả bộ hoặc chọn từng tài liệu. Bản in dùng chữ đen rõ ràng trên giấy trắng."
  ],
  [
    "Crew Certification",
    "Certificación de la tripulación",
    "Chứng nhận thành viên phi hành đoàn"
  ],
  [
    "Four stamp boxes and one reflection prompt per machine.",
    "Cuatro casillas para sellos y una pregunta de reflexión por máquina.",
    "Bốn ô đóng dấu và một câu hỏi suy ngẫm cho mỗi cỗ máy."
  ],
  [
    "Print Crew Certification",
    "Imprimir certificación de la tripulación",
    "In phiếu chứng nhận thành viên"
  ],
  [
    "Pre-Visit KWL",
    "KWL antes de la visita",
    "KWL trước hành trình"
  ],
  [
    "Know, Want to know, and Learned prompts for all four machines.",
    "Preguntas sobre lo que sé, quiero saber y aprendí de las cuatro máquinas.",
    "Gợi ý Đã biết, Muốn biết và Đã học cho cả bốn cỗ máy."
  ],
  [
    "Print Pre-Visit KWL",
    "Imprimir KWL antes de la visita",
    "In bảng KWL trước hành trình"
  ],
  [
    "Exit Tickets",
    "Boletos de salida",
    "Phiếu cuối giờ"
  ],
  [
    "Four half-page tickets with exhibit reflection and a 3-2-1 check.",
    "Cuatro boletos de media página con una reflexión sobre el módulo y una comprobación 3-2-1.",
    "Bốn phiếu nửa trang để suy ngẫm về mô-đun và kiểm tra theo cách 3-2-1."
  ],
  [
    "Print Exit Tickets",
    "Imprimir boletos de salida",
    "In phiếu cuối giờ"
  ],
  [
    "Mission Quiz",
    "Cuestionario de misión",
    "Trắc nghiệm nhiệm vụ"
  ],
  [
    "Ten multiple-choice questions plus a separate teacher answer key.",
    "Diez preguntas de opción múltiple y una clave de respuestas separada para docentes.",
    "Mười câu hỏi trắc nghiệm kèm đáp án riêng cho giáo viên."
  ],
  [
    "Print Mission Quiz",
    "Imprimir cuestionario de misión",
    "In trắc nghiệm nhiệm vụ"
  ],
  [
    "05",
    "05",
    "05"
  ],
  [
    "Write Like a Machine",
    "Escribe como una máquina",
    "Viết như một cỗ máy"
  ],
  [
    "A first-person machine diary worksheet with ELA prompts.",
    "Una ficha para escribir el diario de una máquina en primera persona, con propuestas de lengua y literatura.",
    "Phiếu viết nhật ký ngôi thứ nhất của cỗ máy, kèm gợi ý môn ngôn ngữ và văn học (ELA)."
  ],
  [
    "Print Write Like a Machine",
    "Imprimir Escribe como una máquina",
    "In bài Viết như một cỗ máy"
  ],
  [
    "CHECK UNDERSTANDING",
    "COMPROBAR LO APRENDIDO",
    "KIỂM TRA MỨC ĐỘ HIỂU"
  ],
  [
    "Assessment ideas",
    "Ideas de evaluación",
    "Gợi ý đánh giá"
  ],
  [
    "3-2-1 exit ticket",
    "Boleto de salida 3-2-1",
    "Phiếu cuối giờ 3-2-1"
  ],
  [
    "— fastest formative check; scan for the exhibit-guide misconceptions.",
    "— la comprobación formativa más rápida; busca las ideas equivocadas de las guías.",
    "— cách kiểm tra nhanh trong quá trình học; chú ý những ngộ nhận trong hướng dẫn từng mô-đun."
  ],
  [
    "Claim–Evidence–Reasoning paragraph:",
    "Párrafo Afirmación–Pruebas–Razonamiento:",
    "Đoạn văn Khẳng định–Bằng chứng–Lập luận:"
  ],
  [
    "“Pick one machine. Make a claim about what it taught humanity. Support it with two facts from its exhibit.” Example stem: “Ingenuity had to fly itself because ___; we know this because ___.”",
    "«Elige una máquina. Formula una afirmación sobre lo que enseñó a la humanidad. Apóyala con dos datos de su módulo». Ejemplo para comenzar: «Ingenuity tenía que volar por sí mismo porque ___; lo sabemos porque ___».",
    "“Chọn một cỗ máy. Đưa ra một khẳng định về điều nó dạy nhân loại. Dùng hai dữ kiện trong mô-đun để chứng minh.” Gợi ý mở đầu: “Ingenuity phải tự bay vì ___; chúng ta biết điều này vì ___.”"
  ],
  [
    "Mini-poster: Adopt a Machine",
    "Mini póster: Adopta una máquina",
    "Áp phích nhỏ: Đồng hành cùng một cỗ máy"
  ],
  [
    "— student pairs produce a one-page “mission profile” for their machine: name, mission, hardest moment, one number that matters (distance, flight count, mirror size…), drawn or printed image.",
    "— por parejas, preparan un «perfil de misión» de una página: nombre, misión, momento más difícil, una cifra importante (distancia, número de vuelos, tamaño del espejo…) e imagen dibujada o impresa.",
    "— học sinh làm theo cặp, tạo một trang “hồ sơ nhiệm vụ” cho cỗ máy: tên, nhiệm vụ, thời khắc khó nhất, một con số quan trọng (khoảng cách, số chuyến bay, kích thước gương…) và hình vẽ hoặc ảnh in."
  ],
  [
    "Quick rubric (optional, for the write-up):",
    "Rúbrica rápida (opcional, para el escrito):",
    "Tiêu chí chấm nhanh (tùy chọn, cho bài viết):"
  ],
  [
    "Accuracy of two facts (from the exhibit) · Habitability-vs-life / delay / scale distinction used correctly · First-person voice sustained · One reflection beyond the facts.",
    "Dos datos correctos del módulo · Distinción correcta entre habitabilidad y vida, retraso o escala · Voz en primera persona sostenida · Una reflexión más allá de los datos.",
    "Hai dữ kiện chính xác (từ mô-đun) · Phân biệt đúng khả năng hỗ trợ sự sống với sự sống / độ trễ / quy mô · Duy trì lời kể ngôi thứ nhất · Có suy ngẫm ngoài các dữ kiện."
  ],
  [
    "GO FURTHER",
    "IR MÁS ALLÁ",
    "KHÁM PHÁ THÊM"
  ],
  [
    "Extension activities",
    "Actividades de ampliación",
    "Hoạt động mở rộng"
  ],
  [
    "Design the 5th exhibit.",
    "Diseña el quinto módulo.",
    "Thiết kế mô-đun thứ năm."
  ],
  [
    "Which machine deserves the next gallery — Perseverance? Europa Clipper? Hubble? Students pitch: hook sentence, the challenge trainees would play, the one fact nobody forgets.",
    "¿Qué máquina merece la próxima galería: Perseverance, Europa Clipper, Hubble? Los estudiantes presentan una frase inicial, el desafío que jugarían los aprendices y el dato que nadie olvidará.",
    "Cỗ máy nào xứng đáng có khu tiếp theo — Perseverance, Europa Clipper hay Hubble? Học sinh đề xuất câu dẫn mở đầu, thử thách dành cho học viên và một sự thật không ai quên."
  ],
  [
    "Record your own Golden Record.",
    "Graba tu propio Disco de Oro.",
    "Thu âm Đĩa Vàng của lớp."
  ],
  [
    "60 seconds of audio per class: a greeting, a sound of your school, one song. Discuss: what did you leave out, and why? (Pairs with Voyager's 55 languages.)",
    "60 segundos de audio por clase: un saludo, un sonido de la escuela y una canción. Comenten qué dejaron fuera y por qué. (Se relaciona con los 55 idiomas de Voyager).",
    "Mỗi lớp có 60 giây âm thanh: một lời chào, một âm thanh của trường, một bài hát. Thảo luận: lớp đã bỏ điều gì ra ngoài, và vì sao? (Kết nối với 55 ngôn ngữ trên Voyager.)"
  ],
  [
    "Light-time math.",
    "Matemáticas del tiempo de viaje de la luz.",
    "Tính thời gian ánh sáng truyền."
  ],
  [
    "Using the live Voyager number on screen and the speed of light (299,792 km/s), compute one-way signal time. Then: how long would a signal take to reach Voyager 2? New Horizons? The nearest star? (Ratios & proportional reasoning.)",
    "Con la cifra de Voyager en vivo y la velocidad de la luz (299.792 km/s), calcula el tiempo de viaje de la señal en un sentido. Después: ¿cuánto tardaría una señal en llegar a Voyager 2, New Horizons o la estrella más cercana? (Razones y razonamiento proporcional).",
    "Dùng số Voyager cập nhật trực tiếp trên màn hình và tốc độ ánh sáng (299.792 km/s) để tính thời gian tín hiệu đi một chiều. Sau đó: tín hiệu đến Voyager 2 mất bao lâu? New Horizons? Ngôi sao gần nhất? (Tỉ số và suy luận tỉ lệ.)"
  ],
  [
    "The engineers' constraint.",
    "La restricción de los ingenieros.",
    "Ràng buộc của kỹ sư."
  ],
  [
    "Each exhibit hides one hard constraint (delay, thin air, rocket size, power). Students write the “constraint card” for a machine of their choice:",
    "Cada módulo esconde una restricción difícil (retraso, aire tenue, tamaño del cohete, energía). Los estudiantes escriben la «tarjeta de restricción» de una máquina que elijan:",
    "Mỗi mô-đun có một ràng buộc khó (độ trễ, không khí loãng, kích thước tên lửa, năng lượng). Học sinh viết “thẻ ràng buộc” cho cỗ máy mình chọn:"
  ],
  [
    "The hard thing was… so the engineers…",
    "Lo difícil era… así que los ingenieros…",
    "Điều khó là… vì thế các kỹ sư…"
  ],
  [
    "LESSON PLANNING",
    "PLANIFICACIÓN DE CLASES",
    "LẬP KẾ HOẠCH BÀI DẠY"
  ],
  [
    "Standards map",
    "Mapa de estándares",
    "Bảng đối chiếu chuẩn học tập"
  ],
  [
    "Exhibit",
    "Módulo",
    "Mô-đun"
  ],
  [
    "NGSS",
    "NGSS",
    "NGSS"
  ],
  [
    "Also supports",
    "También apoya",
    "Cũng hỗ trợ"
  ],
  [
    "Curiosity",
    "Curiosity",
    "Curiosity"
  ],
  [
    "MS-ESS1-3 (scale properties) · MS-ETS1-4 (iterative design)",
    "MS-ESS1-3 (propiedades de escala) · MS-ETS1-4 (diseño con ajustes sucesivos)",
    "MS-ESS1-3 (đặc điểm quy mô) · MS-ETS1-4 (thiết kế qua nhiều lần thử và điều chỉnh)"
  ],
  [
    "MS-ESS2-2 by analogy (reading surface history — taught on Mars strata; the standard is Earth-framed, the thinking transfers)",
    "MS-ESS2-2 por analogía (leer la historia de la superficie usando estratos de Marte; el estándar se centra en la Tierra, pero el razonamiento se transfiere)",
    "MS-ESS2-2 qua liên hệ tương tự (đọc lịch sử bề mặt — học qua địa tầng sao Hỏa; chuẩn này tập trung vào Trái Đất, nhưng cách tư duy có thể áp dụng)"
  ],
  [
    "Ingenuity",
    "Ingenuity",
    "Ingenuity"
  ],
  [
    "MS-PS2-2 (forces & motion) · MS-ETS1-3 (test data → improvement)",
    "MS-PS2-2 (fuerzas y movimiento) · MS-ETS1-3 (datos de pruebas → mejoras)",
    "MS-PS2-2 (lực và chuyển động) · MS-ETS1-3 (dữ liệu thử nghiệm → cải tiến)"
  ],
  [
    "Engineering design (MS-ETS1-1) — defining the flight problem",
    "Diseño de ingeniería (MS-ETS1-1): definir el problema del vuelo",
    "Thiết kế kỹ thuật (MS-ETS1-1) — xác định bài toán bay"
  ],
  [
    "Webb",
    "Webb",
    "Webb"
  ],
  [
    "MS-PS4-2 (reflection of waves) · MS-ETS1-4",
    "MS-PS4-2 (reflexión de ondas) · MS-ETS1-4",
    "MS-PS4-2 (sự phản xạ sóng) · MS-ETS1-4"
  ],
  [
    "HS-ESS1-2 at upper end (universe's expansion, redshift)",
    "HS-ESS1-2 para el nivel superior (expansión del universo, corrimiento al rojo)",
    "HS-ESS1-2 ở mức học cao hơn (vũ trụ giãn nở, dịch chuyển đỏ)"
  ],
  [
    "Voyager 1",
    "Voyager 1",
    "Voyager 1"
  ],
  [
    "MS-ESS1-3 (solar-system scale — strongest fit) · MS-PS4-3 (digitized signals)",
    "MS-ESS1-3 (escala del sistema solar: correspondencia más clara) · MS-PS4-3 (señales digitalizadas)",
    "MS-ESS1-3 (quy mô Hệ Mặt Trời — phù hợp nhất) · MS-PS4-3 (tín hiệu số)"
  ],
  [
    "CCSS Math 6.RP/7.RP (light-time ratios) · ELA W.6-8.3 (narrative writing, Write Like a Machine)",
    "CCSS Math 6.RP/7.RP (razones de tiempo de viaje de la luz) · ELA W.6-8.3 (escritura narrativa, Escribe como una máquina)",
    "CCSS Math 6.RP/7.RP (tỉ số thời gian ánh sáng truyền) · ELA W.6-8.3 (viết tự sự, Viết như một cỗ máy)"
  ],
  [
    "Alignments are provided as a starting point for lesson planning; verify against your state's adopted standards.",
    "Estas correspondencias son un punto de partida para planificar; compruébalas con los estándares adoptados en tu estado.",
    "Các đối chiếu này là điểm bắt đầu để soạn bài; hãy kiểm tra với chuẩn học tập được áp dụng tại địa phương của bạn."
  ],
  [
    "ACCESS FOR EVERY LEARNER",
    "ACCESO PARA TODO EL ALUMNADO",
    "MỌI HỌC SINH ĐỀU CÓ THỂ THAM GIA"
  ],
  [
    "Accessibility & tech",
    "Accesibilidad y tecnología",
    "Khả năng tiếp cận và công nghệ"
  ],
  [
    "Full keyboard navigation — every exhibit and challenge can be completed without a mouse.",
    "Navegación completa por teclado: todos los módulos y desafíos pueden completarse sin ratón.",
    "Điều hướng hoàn toàn bằng bàn phím — mọi mô-đun và thử thách đều có thể hoàn thành mà không cần chuột."
  ],
  [
    "Reduce motion",
    "Reducir movimiento",
    "Giảm chuyển động"
  ],
  [
    "toggle and",
    "y la opción",
    "và chế độ"
  ],
  [
    "2D view",
    "Vista 2D",
    "Góc nhìn 2D"
  ],
  [
    "fallback, both reachable from the footer.",
    "como alternativa, ambas disponibles desde el pie de página.",
    "thay thế, đều có thể mở từ chân trang."
  ],
  [
    "Works with shared devices: no login, progress lives in the crew certification on the student's device.",
    "Permite compartir dispositivos: sin inicio de sesión, el progreso se guarda en la certificación de la tripulación en el dispositivo del estudiante.",
    "Dùng được trên thiết bị dùng chung: không cần đăng nhập, tiến trình được lưu trong chứng nhận thành viên trên thiết bị của học sinh."
  ],
  [
    "Golden Record greetings are listed with language names and translations. No microphone is required: a student can write a greeting to complete Voyager.",
    "Los saludos del Disco de Oro incluyen nombres de idiomas y traducciones. No se necesita micrófono: un estudiante puede escribir un saludo para completar Voyager.",
    "Lời chào trên Đĩa Vàng có tên ngôn ngữ và bản dịch. Không cần micro: học sinh có thể viết lời chào để hoàn thành Voyager."
  ],
  [
    "Use a current Chrome, Edge, Safari, or Firefox browser. Internet is needed for Voyager's live JPL distance.",
    "Usa una versión actual de Chrome, Edge, Safari o Firefox. Se necesita internet para la distancia de Voyager en vivo de JPL.",
    "Dùng Chrome, Edge, Safari hoặc Firefox phiên bản hiện hành. Cần internet để xem khoảng cách Voyager cập nhật trực tiếp từ JPL."
  ],
  [
    "Clearing browser data resets stamps; use the printable certification sheet if that matters for grading.",
    "Borrar los datos del navegador reinicia los sellos; usa la hoja de certificación imprimible si cuentan para la evaluación.",
    "Xóa dữ liệu trình duyệt sẽ đặt lại các dấu; hãy dùng phiếu chứng nhận in được nếu cần ghi nhận để đánh giá."
  ],
  [
    "PRIVACY & SAFETY",
    "PRIVACIDAD Y SEGURIDAD",
    "QUYỀN RIÊNG TƯ VÀ AN TOÀN"
  ],
  [
    "Built for school devices",
    "Pensado para dispositivos escolares",
    "Thiết kế cho thiết bị trường học"
  ],
  [
    "No accounts, sign-ups, required names, or emails — for students or teachers.",
    "Sin cuentas, registros, nombres obligatorios ni correos electrónicos, ni para estudiantes ni para docentes.",
    "Không cần tài khoản, đăng ký, tên hay email bắt buộc — cho cả học sinh và giáo viên."
  ],
  [
    "Crew certification progress never leaves the device. A personal greeting stays private until someone explicitly submits it to a classroom record. After a teacher approves it, anyone online can find it in the classroom gallery. Use nicknames and class titles that do not identify students.",
    "El progreso de certificación nunca sale del dispositivo. Un saludo personal permanece privado hasta que alguien lo envía expresamente a un disco de clase. Tras la aprobación del docente, cualquier persona en internet puede encontrarlo en la galería de la clase. Usa apodos y nombres de clase que no identifiquen a los estudiantes.",
    "Tiến trình chứng nhận không rời khỏi thiết bị. Lời chào cá nhân được giữ riêng tư cho đến khi người dùng chủ động gửi vào đĩa của lớp. Sau khi giáo viên duyệt, bất kỳ ai trên internet cũng có thể tìm thấy lời chào trong bộ sưu tập của lớp. Dùng biệt danh và tên lớp không làm lộ danh tính học sinh."
  ],
  [
    "No ads, chat, or external social embeds inside exhibits.",
    "Sin anuncios, chat ni contenido incrustado de redes sociales externas dentro de los módulos.",
    "Không có quảng cáo, trò chuyện hay nội dung mạng xã hội bên ngoài được nhúng trong mô-đun."
  ],
  [
    "Science claims link to NASA/JPL sources in each exhibit and the Field notes panel.",
    "Las afirmaciones científicas enlazan a fuentes NASA/JPL en cada módulo y en el panel Notas de campo.",
    "Các thông tin khoa học liên kết tới nguồn NASA/JPL trong từng mô-đun và bảng Ghi chép thực địa."
  ],
  [
    "COMMON QUESTIONS",
    "PREGUNTAS HABITUALES",
    "CÂU HỎI THƯỜNG GẶP"
  ],
  [
    "FAQ",
    "Preguntas frecuentes",
    "Hỏi đáp"
  ],
  [
    "Does it cost anything?",
    "¿Tiene algún costo?",
    "Có mất phí không?"
  ],
  [
    "No. It's free, and it stays on the open web.",
    "No. Es gratis y permanece en la web abierta.",
    "Không. Ứng dụng miễn phí và luôn có trên web mở."
  ],
  [
    "Do my students need accounts?",
    "¿Mis estudiantes necesitan cuentas?",
    "Học sinh có cần tài khoản không?"
  ],
  [
    "No. They open the page and walk in. That's deliberate — it works on locked-down school devices.",
    "No. Abren la página y entran. Es intencional: así funciona en dispositivos escolares con acceso restringido.",
    "Không. Các em chỉ cần mở trang và vào học. Đây là lựa chọn có chủ đích để dùng được trên thiết bị trường học bị hạn chế quyền truy cập."
  ],
  [
    "How long is a visit?",
    "¿Cuánto dura una visita?",
    "Một hành trình kéo dài bao lâu?"
  ],
  [
    "One class period for all four exhibits (40–50 min). A single exhibit takes 8–12 minutes and stands alone — assign one as homework or a warm-up.",
    "Una clase para los cuatro módulos (40–50 min). Un módulo tarda 8–12 minutos y es independiente: puede asignarse como tarea o actividad inicial.",
    "Một tiết học cho cả bốn mô-đun (40–50 phút). Mỗi mô-đun mất 8–12 phút và có nội dung độc lập — có thể giao làm bài tập về nhà hoặc khởi động đầu giờ."
  ],
  [
    "Can I assign just one exhibit?",
    "¿Puedo asignar un solo módulo?",
    "Có thể chỉ giao một mô-đun không?"
  ],
  [
    "Yes. Each exhibit ends with its own reflection question and stamp. Start with Curiosity for the fullest story arc, or Voyager 1 if you're teaching scale and distance.",
    "Sí. Cada módulo termina con su propia pregunta de reflexión y sello. Empieza por Curiosity para el arco narrativo más completo, o por Voyager 1 si enseñas escala y distancia.",
    "Có. Mỗi mô-đun kết thúc bằng câu hỏi suy ngẫm và dấu riêng. Bắt đầu với Curiosity để có mạch truyện đầy đủ nhất, hoặc Voyager 1 nếu dạy về quy mô và khoảng cách."
  ],
  [
    "A student lost their stamps. What now?",
    "Un estudiante perdió sus sellos. ¿Qué hago?",
    "Học sinh mất dấu đã nhận thì sao?"
  ],
  [
    "Progress lives in the browser on that device. If browser data was cleared, the printable certification sheet is the backup record — or have them re-earn the stamp; each exhibit is replayable.",
    "El progreso se guarda en el navegador de ese dispositivo. Si se borraron sus datos, la hoja de certificación imprimible sirve de respaldo; también pueden volver a conseguir el sello, porque todos los módulos se pueden repetir.",
    "Tiến trình được lưu trong trình duyệt trên thiết bị đó. Nếu dữ liệu trình duyệt bị xóa, phiếu chứng nhận in được là bản dự phòng — hoặc học sinh có thể lấy lại dấu; mô-đun nào cũng chơi lại được."
  ],
  [
    "Can students take something home?",
    "¿Los estudiantes pueden llevarse algo a casa?",
    "Học sinh có gì để mang về nhà không?"
  ],
  [
    "Yes. After collecting all four stamps, they can enter a name and print a one-page Mission Alive Graduate certificate. The name stays in the browser and is not uploaded.",
    "Sí. Tras reunir los cuatro sellos, pueden escribir un nombre e imprimir un certificado de graduación de Mission Alive de una página. El nombre permanece en el navegador y no se sube al servidor.",
    "Có. Sau khi thu thập đủ bốn dấu, các em có thể nhập tên và in chứng chỉ tốt nghiệp Mission Alive một trang. Tên chỉ được giữ trong trình duyệt, không tải lên máy chủ."
  ],
  [
    "Does it work on our Chromebooks?",
    "¿Funciona en nuestros Chromebooks?",
    "Có dùng được trên Chromebook của trường không?"
  ],
  [
    "Yes — it's a web page, no installs. It also runs whole-class from one computer and a projector.",
    "Sí: es una página web, sin instalaciones. También puede usarse con toda la clase desde una computadora y un proyector.",
    "Có — đây là trang web, không cần cài đặt. Cũng có thể dùng một máy tính và máy chiếu cho cả lớp cùng học."
  ],
  [
    "Where does the science come from?",
    "¿De dónde procede la información científica?",
    "Thông tin khoa học lấy từ đâu?"
  ],
  [
    "Each exhibit cites NASA/JPL sources in its mission archive and Field notes. Voyager's distance is live from JPL's Horizons system.",
    "Cada módulo cita fuentes NASA/JPL en su archivo de misión y sus Notas de campo. La distancia de Voyager llega en vivo del sistema Horizons de JPL.",
    "Mỗi mô-đun dẫn nguồn NASA/JPL trong kho tư liệu nhiệm vụ và Ghi chép thực địa. Khoảng cách Voyager được cập nhật trực tiếp từ hệ thống Horizons của JPL."
  ],
  [
    "READY WHEN YOUR CLASS IS",
    "LISTO CUANDO TU CLASE LO ESTÉ",
    "SẴN SÀNG KHI LỚP CỦA BẠN SẴN SÀNG"
  ],
  [
    "Four machines. One class period.",
    "Cuatro máquinas. Una clase.",
    "Bốn cỗ máy. Một tiết học."
  ],
  [
    "MISSION ALIVE",
    "MISSION ALIVE",
    "MISSION ALIVE"
  ],
  [
    "Name ______________________________ Class __________ Date __________",
    "Nombre ______________________________ Clase __________ Fecha __________",
    "Tên ______________________________ Lớp __________ Ngày __________"
  ],
  [
    "STAMP OR CHECK",
    "SELLO O MARCA",
    "ĐÓNG DẤU HOẶC ĐÁNH DẤU"
  ],
  [
    "One thing this machine taught me:",
    "Algo que me enseñó esta máquina:",
    "Một điều cỗ máy này dạy em:"
  ],
  [
    "4 / 4 STAMPS = CERTIFIED CREW",
    "4 / 4 SELLOS = TRIPULACIÓN CERTIFICADA",
    "4 / 4 DẤU = THÀNH VIÊN ĐƯỢC CHỨNG NHẬN"
  ],
  [
    "Before training, write what you already know and what you want to learn. Return afterward to complete the last column.",
    "Antes de empezar, escribe lo que ya sabes y lo que quieres aprender. Vuelve al terminar para completar la última columna.",
    "Trước khi huấn luyện, viết điều em đã biết và muốn học. Sau đó quay lại điền cột cuối."
  ],
  [
    "Machine",
    "Máquina",
    "Cỗ máy"
  ],
  [
    "What I know",
    "Lo que sé",
    "Điều em đã biết"
  ],
  [
    "What I want to know",
    "Lo que quiero saber",
    "Điều em muốn biết"
  ],
  [
    "What I learned",
    "Lo que aprendí",
    "Điều em đã học"
  ],
  [
    "Cut into two half-page tickets. Give each learner the exhibit they explored.",
    "Corta la hoja en dos boletos de media página. Da a cada estudiante el del módulo que exploró.",
    "Cắt thành hai phiếu nửa trang. Phát cho mỗi học sinh phiếu của mô-đun mà em đã khám phá."
  ],
  [
    "AFTER",
    "DESPUÉS",
    "SAU"
  ],
  [
    "facts I learned",
    "datos que aprendí",
    "điều em đã học"
  ],
  [
    "questions I still have",
    "preguntas que aún tengo",
    "câu hỏi em vẫn còn"
  ],
  [
    "machine I would want to meet, and why",
    "máquina que me gustaría conocer y por qué",
    "cỗ máy em muốn gặp, và lý do"
  ],
  [
    "What did Curiosity find in Gale Crater?",
    "¿Qué encontró Curiosity en el cráter Gale?",
    "Curiosity tìm thấy gì trong hố Gale?"
  ],
  [
    "Living aliens",
    "Extraterrestres vivos",
    "Sinh vật ngoài hành tinh còn sống"
  ],
  [
    "Conditions that could once support microbial life",
    "Condiciones que pudieron albergar vida microbiana en el pasado",
    "Điều kiện từng có thể hỗ trợ vi sinh vật"
  ],
  [
    "A working spacecraft",
    "Una nave espacial en funcionamiento",
    "Một tàu vũ trụ đang hoạt động"
  ],
  [
    "Plants",
    "Plantas",
    "Thực vật"
  ],
  [
    "Why do engineers upload command sequences to Curiosity?",
    "¿Por qué los ingenieros cargan secuencias de instrucciones en Curiosity?",
    "Vì sao kỹ sư gửi chuỗi lệnh cho Curiosity?"
  ],
  [
    "It has no wheels",
    "No tiene ruedas",
    "Xe không có bánh"
  ],
  [
    "Its camera is broken",
    "Su cámara está averiada",
    "Máy ảnh của xe bị hỏng"
  ],
  [
    "Signal delay prevents live joystick driving",
    "El retraso de la señal impide conducir en directo con un joystick",
    "Độ trễ tín hiệu ngăn việc lái trực tiếp bằng cần điều khiển"
  ],
  [
    "Mars has no gravity",
    "Marte no tiene gravedad",
    "Sao Hỏa không có trọng lực"
  ],
  [
    "Why is flight difficult on Mars?",
    "¿Por qué es difícil volar en Marte?",
    "Vì sao bay trên sao Hỏa khó?"
  ],
  [
    "The atmosphere is very thin",
    "La atmósfera es muy tenue",
    "Khí quyển rất loãng"
  ],
  [
    "Gravity is stronger",
    "La gravedad es mayor",
    "Trọng lực mạnh hơn"
  ],
  [
    "There is no sunlight",
    "No hay luz solar",
    "Không có ánh sáng mặt trời"
  ],
  [
    "Rotors cannot turn",
    "Los rotores no pueden girar",
    "Rotor không thể quay"
  ],
  [
    "Ingenuity was designed for five flights. How many did it complete?",
    "Ingenuity se diseñó para cinco vuelos. ¿Cuántos completó?",
    "Ingenuity được thiết kế cho năm chuyến bay. Nó hoàn thành bao nhiêu chuyến?"
  ],
  [
    "5",
    "5",
    "5"
  ],
  [
    "18",
    "18",
    "18"
  ],
  [
    "55",
    "55",
    "55"
  ],
  [
    "72",
    "72",
    "72"
  ],
  [
    "Why did Webb's primary mirror fold?",
    "¿Por qué se plegó el espejo primario de Webb?",
    "Vì sao gương chính của Webb phải gập?"
  ],
  [
    "To block radio signals",
    "Para bloquear señales de radio",
    "Để chặn tín hiệu vô tuyến"
  ],
  [
    "It was wider than the rocket fairing",
    "Era más ancho que el carenado del cohete",
    "Gương rộng hơn khoang chụp bảo vệ của tên lửa"
  ],
  [
    "To make visible light",
    "Para producir luz visible",
    "Để tạo ánh sáng nhìn thấy"
  ],
  [
    "It broke before launch",
    "Se rompió antes del lanzamiento",
    "Gương bị vỡ trước khi phóng"
  ],
  [
    "How many mirror segments must act as one on Webb?",
    "¿Cuántos segmentos de espejo deben actuar como uno solo en Webb?",
    "Bao nhiêu mảnh gương của Webb phải hoạt động như một gương duy nhất?"
  ],
  [
    "What kind of light does Webb observe?",
    "¿Qué tipo de luz observa Webb?",
    "Webb quan sát loại ánh sáng nào?"
  ],
  [
    "Only ultraviolet",
    "Solo ultravioleta",
    "Chỉ tia tử ngoại"
  ],
  [
    "Infrared",
    "Infrarroja",
    "Hồng ngoại"
  ],
  [
    "Only visible green",
    "Solo luz verde visible",
    "Chỉ ánh sáng xanh lá nhìn thấy"
  ],
  [
    "Radio only",
    "Solo ondas de radio",
    "Chỉ sóng vô tuyến"
  ],
  [
    "How many languages are represented in the Golden Record greetings?",
    "¿Cuántos idiomas aparecen en los saludos del Disco de Oro?",
    "Lời chào trên Đĩa Vàng có bao nhiêu ngôn ngữ?"
  ],
  [
    "4",
    "4",
    "4"
  ],
  [
    "115",
    "115",
    "115"
  ],
  [
    "What does Voyager's pulsar map help describe?",
    "¿Qué ayuda a describir el mapa de púlsares de Voyager?",
    "Bản đồ sao xung của Voyager giúp mô tả điều gì?"
  ],
  [
    "How to fly on Mars",
    "Cómo volar en Marte",
    "Cách bay trên sao Hỏa"
  ],
  [
    "Where our Sun is located",
    "Dónde está nuestro Sol",
    "Vị trí Mặt Trời của chúng ta"
  ],
  [
    "How to align Webb",
    "Cómo alinear Webb",
    "Cách căn chỉnh Webb"
  ],
  [
    "Where Curiosity drilled",
    "Dónde perforó Curiosity",
    "Vị trí Curiosity khoan"
  ],
  [
    "What boundary did Voyager 1 cross in 2012?",
    "¿Qué límite cruzó Voyager 1 en 2012?",
    "Voyager 1 vượt qua ranh giới nào vào năm 2012?"
  ],
  [
    "The heliopause",
    "La heliopausa",
    "Nhật mãn"
  ],
  [
    "Mars's atmosphere",
    "La atmósfera de Marte",
    "Khí quyển sao Hỏa"
  ],
  [
    "Earth's Moon",
    "La Luna de la Tierra",
    "Mặt Trăng của Trái Đất"
  ],
  [
    "Webb's orbit",
    "La órbita de Webb",
    "Quỹ đạo của Webb"
  ],
  [
    "TEACHER COPY",
    "COPIA PARA DOCENTES",
    "BẢN GIÁO VIÊN"
  ],
  [
    "Mission Quiz Answer Key",
    "Respuestas del cuestionario de misión",
    "Đáp án trắc nghiệm nhiệm vụ"
  ],
  [
    "B.",
    "B.",
    "B."
  ],
  [
    "Conditions that could once support microbial life.",
    "Condiciones que pudieron albergar vida microbiana en el pasado.",
    "Điều kiện từng có thể hỗ trợ vi sinh vật."
  ],
  [
    "C.",
    "C.",
    "C."
  ],
  [
    "Signal delay prevents live joystick driving.",
    "El retraso de la señal impide conducir en directo con un joystick.",
    "Độ trễ tín hiệu ngăn việc lái trực tiếp bằng cần điều khiển."
  ],
  [
    "A.",
    "A.",
    "A."
  ],
  [
    "The atmosphere is very thin.",
    "La atmósfera es muy tenue.",
    "Khí quyển rất loãng."
  ],
  [
    "D.",
    "D.",
    "D."
  ],
  [
    "72 flights.",
    "72 vuelos.",
    "72 chuyến bay."
  ],
  [
    "It was wider than the rocket fairing.",
    "Era más ancho que el carenado del cohete.",
    "Gương rộng hơn khoang chụp bảo vệ của tên lửa."
  ],
  [
    "18 mirror segments.",
    "18 segmentos de espejo.",
    "18 mảnh gương."
  ],
  [
    "Infrared light.",
    "Luz infrarroja.",
    "Ánh sáng hồng ngoại."
  ],
  [
    "55 languages.",
    "55 idiomas.",
    "55 ngôn ngữ."
  ],
  [
    "Where our Sun is located.",
    "Dónde está nuestro Sol.",
    "Vị trí Mặt Trời của chúng ta."
  ],
  [
    "The heliopause.",
    "La heliopausa.",
    "Nhật mãn."
  ],
  [
    "MISSION ALIVE · ELA",
    "MISSION ALIVE · LENGUA Y LITERATURA (ELA)",
    "MISSION ALIVE · NGÔN NGỮ VÀ VĂN HỌC (ELA)"
  ],
  [
    "Choose one machine. Write its diary entry for the most important day of its life, in first person.",
    "Elige una máquina. Escribe en primera persona su diario del día más importante de su vida.",
    "Chọn một cỗ máy. Viết nhật ký của nó vào ngày quan trọng nhất trong đời, bằng ngôi thứ nhất."
  ],
  [
    "1 · Choose your voice",
    "1 · Elige tu voz",
    "1 · Chọn nhân vật kể chuyện"
  ],
  [
    "□ Curiosity",
    "□ Curiosity",
    "□ Curiosity"
  ],
  [
    "□ Ingenuity",
    "□ Ingenuity",
    "□ Ingenuity"
  ],
  [
    "□ Webb",
    "□ Webb",
    "□ Webb"
  ],
  [
    "□ Voyager 1",
    "□ Voyager 1",
    "□ Voyager 1"
  ],
  [
    "2 · Plan the moment",
    "2 · Planifica el momento",
    "2 · Lên ý cho thời khắc"
  ],
  [
    "The day I chose: __________________________________________________________________",
    "El día que elegí: __________________________________________________________________",
    "Ngày em chọn: __________________________________________________________________"
  ],
  [
    "The hardest thing was: _____________________________________________________________",
    "Lo más difícil fue: _____________________________________________________________",
    "Điều khó nhất là: _____________________________________________________________"
  ],
  [
    "I sensed or discovered: ____________________________________________________________",
    "Percibí o descubrí: ____________________________________________________________",
    "Tôi cảm nhận hoặc phát hiện: ____________________________________________________________"
  ],
  [
    "This mattered because: _____________________________________________________________",
    "Esto importó porque: _____________________________________________________________",
    "Điều này quan trọng vì: _____________________________________________________________"
  ],
  [
    "3 · Begin in first person",
    "3 · Empieza en primera persona",
    "3 · Bắt đầu bằng ngôi thứ nhất"
  ],
  [
    "My name is ____________________. I am ____________________. Today, I ____________________.",
    "Me llamo ____________________. Soy ____________________. Hoy, yo ____________________.",
    "Tên tôi là ____________________. Tôi là ____________________. Hôm nay, tôi ____________________."
  ],
  [
    "Check before submitting:",
    "Comprueba antes de entregar:",
    "Kiểm tra trước khi nộp:"
  ],
  [
    "I stayed in first person · I used two accurate facts from the exhibit · I described a feeling, choice, or reflection beyond the facts.",
    "Mantuve la primera persona · Usé dos datos correctos del módulo · Describí un sentimiento, una decisión o una reflexión más allá de los datos.",
    "Em giữ ngôi thứ nhất · Em dùng hai dữ kiện chính xác từ mô-đun · Em mô tả cảm xúc, lựa chọn hoặc suy ngẫm ngoài các dữ kiện."
  ]
];

export const es = Object.fromEntries(entries.map(([english, spanish]) => [english, spanish]));
export const vi = Object.fromEntries(entries.map(([english, , vietnamese]) => [english, vietnamese]));
