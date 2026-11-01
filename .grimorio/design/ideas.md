# Ideas saved for later

Ideas of the principal that cut across all of grimorio and belong to no single design yet. Each one keeps his words
verbatim, says where it already touches a design, and stays **saved, not designed** until he takes it up. Kept from
message U51 of session `ab161c11` (2026-11-01).

## 1. Distillation

> "Hay que destilar mucho el conocimiento, por ejemplo, un cuaderno, un cuaderno que quiere revisar 20 líneas, que
> todos los métodos tengan al menos 20 líneas. Ok, ¿cómo lo hace? Va y revisa todas las líneas de código a mano. Es
> una opción. Podría descargar una librería que parsee, traiga solamente las líneas de texto y las cuente. Es otra
> manera. Y además es una manera determinística"

> "Si pido formatter, claro, puedes crearse un linter y correrlo sobre el código."

What a strong model works out once, correctly, becomes a script, a library call or a fixed check, so that no model has
to redo it by hand and get it right at that moment.

**Where it already shows:** the task flow's invariant checks, plan checker and step gate
(ref:repo/.grimorio/design/task-flow/quasi-software-view.md §9).

## 2. Symbiosis

> "Simbiosis o harness, ¿no? Que es lo mismo que hace Claude Code cuando va a invocar algo, por ejemplo. Hace una
> búsqueda de un archivo. Bueno, te pone harness para que puedas invocar archivos"

> "Que es lo que ya tenemos medio avanzado también con las librerías y esas cosas. Yo le he puesto simbiosis porque
> harness lo estoy usando para otra cosa."

> "Quizás podría cambiar el término de los harness de fan.md"

Tools built for the model to call, the way Claude Code hands it file search, so the model invokes a capability
instead of carrying it out in prose.

**Where it already shows:** the task flow's evidence-capture tools and render script (§5, §6). **Open:** the word
"harness" names other things in this corpus; renaming one of them is his call.

## 3. Introspection

> "con las fases, estaba acertando de que, oye, revisa que hayas ejecutado efectivamente un texto, creando un archivo
> y luego revisándolo posteriormente que existe el archivo, por ejemplo. Pero no era necesario porque puedo revisar la
> salida del chat si el chat es consciente de lo que él está escribiendo."

> "ya que tenemos formas de cómo encontrar ahí a la gente, sabemos exactamente qué está haciendo, de repente la gente
> puede chequear su propio trabajo"

> "durante la ejecución de esta gente tuve tantos fallos, pasa por esto"

> "utilizarla tanto para acertar cosas como para detectar fallos, mejores, compilación y todo"

Reading an agent's own transcript, its own or a child's found by its id, to assert what it did, to find where it
failed, and to learn from it, instead of making it write a file only to check later that the file exists.

**Where it already shows:** the task flow's failure card and "what each agent did", reachable by agent id (§4, §6).
It could replace part of the evidence-on-disk checks wherever the transcript already proves the step.
