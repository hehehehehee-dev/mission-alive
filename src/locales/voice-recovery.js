const rows = [
  ['Hear my message','Escucha mi mensaje','Nghe lời nhắn của tôi'],
  ['Stop my message','Detener mi mensaje','Dừng lời nhắn'],
  ['English recording · character message','Grabación en inglés · mensaje del personaje','Bản thu tiếng Anh · lời nhắn của nhân vật'],
  ['Audio could not play. Try again or read my message below.','No se pudo reproducir el audio. Inténtalo de nuevo o lee mi mensaje abajo.','Chưa phát được âm thanh. Thử lại hoặc đọc lời nhắn bên dưới.'],
  ['Repair & restart rover','Reparar y reiniciar el rover','Sửa xe và thử lại'],
  ['Your blocks stay. Change the route and try again.','Conservas tus bloques. Cambia la ruta e inténtalo de nuevo.','Giữ nguyên các block. Sửa đường đi rồi thử lại.'],
  ['Rover repaired. Your blocks are ready to edit.','Rover reparado. Tus bloques están listos para editar.','Xe đã được sửa. Bạn có thể sửa các block.'],
  ['Rover repaired. Continue exploring from the start.','Rover reparado. Sigue explorando desde el inicio.','Xe đã được sửa. Tiếp tục khám phá từ điểm bắt đầu.'],
  ['ROVER READY · TRY A SAFER ROUTE','ROVER LISTO · PRUEBA UNA RUTA MÁS SEGURA','XE SẴN SÀNG · THỬ ĐƯỜNG ĐI AN TOÀN HƠN'],
  ['Rover damaged. Use Repair & restart rover, then change the route.','Rover dañado. Usa Reparar y reiniciar el rover y cambia la ruta.','Xe đã hỏng. Bấm Sửa xe và thử lại, rồi đổi đường đi.'],
];
export const es = Object.fromEntries(rows.map(([en, value]) => [en, value]));
export const vi = Object.fromEntries(rows.map(([en, , value]) => [en, value]));
