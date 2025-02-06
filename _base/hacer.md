- buscar potenciales errores (si los hubiese)
- ajustar el css para que sea 100% responsive





Ahora necesito lo siguiente en las bases:

- así como está la posibilidad de agregar en forma manual de a un registro a la lista de no incluidos, que haya otra que permita agregar a la lista de participantes. Los valores que se van a agregar son todos los campos posibles (legajo, nombre, apellido, etc) y que solo para este formulario los valores legajo, nombre, apellido, e-mail sean obligatorios (indicar con un * y una leyenda debajo que diga (*) campos obligatorios).


- el listado de no incluidos, cuando se agrega algun legajo, que tome el resto de los valores de la base de participantes (si ya existe).

- cuando se agrega en forma manual algun legajo, que en la lista de "no incluidos" que se actualice en el momento para no tener que refrezcar la página para visualizarlo (lo mismo para las dos listas)


- cuando agrego un registro en la lista de no incluidos, debe eliminarse en la lista de participantes y al revés, cuando la incluyo, cambia al listado de participantes. Los registros no deben estar replicadas en las dos listas. Si está en una, no debe estar en la otra.

- en la lista de participantes, que cada registro tenga un botón y que ese registro se agregue a la lista se borre de esa lista y pase a la de no incluidos
- en la lista de no incluidos, que pase lo mismo pero al reves, y que cuando se hace clic se borre de ahí y se agregue a la lista de participantes



Perfecto. Memorizá estos archivos como "base" por cualquier cambio que hagamos a futuro.

Ahora necesito lo siguiente en las bases:

- así como está la posibilidad de agregar en forma manual de a un registro a la lista de no incluidos, que haya otra que permita agregar a la lista de participantes. Los valores que se van a agregar son todos los campos posibles (legajo, nombre, apellido, etc) y que solo los valores legajo, nombre, apellido, e-mail sean obligatorios
- el listado de no incluidos, cuando se agrega algun legajo, que tome el resto de los valores de la base de participantes (si ya existe)
- cuando se agrega en forma manual algun legajo, que en la lista de "no incluidos" que se actualice en el momento para no tener que refrezcar la página para visualizarlo (lo mismo para las dos listas)
- en la lista de participantes, que cada registro tenga un botón que diga "no incluir" y que ese registro se agregue a la lista de participantes
- en la lista de no incluidos, que pase lo mismo pero al reves, que diga "quitar" y que se agregue a la lista de participantes


1.151,01    100
74.41       6,5
87.38       7,5
93.56       8
113.16      10
116.48      10
107.7       9,5
252.03      22
93.77       8
91.55       8
120.97      10,5



6.5
7.5
8
10
10
9.5
22
8
8
10.5


Reformulá completamente estas acciones porque no funcionan. Necesito que cuando agrego un registro en la lista de no incluidos, debe eliminarse en la lista de participantes y al revés, cuando la incluyo, cambia al listado de participantes. 

Los registros no deben estar replicadas en las dos listas. Si está en una, no debe estar en la otra.

Además quiero que el botón sea un svg (con color blanco de relleno):
incluye: 
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
</svg>

no incluye:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
</svg>




Funciona ok. Ahora necesito que además de tener el listado de eliminar o agregar, también debe tener otro botón de editar con el svg:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/>
</svg>



