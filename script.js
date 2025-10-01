(function(){
  const form = document.getElementById('addForm');
  const input = document.getElementById('itemInput');
  const listEl = document.getElementById('list');
  const totalEl = document.getElementById('total');
  const doneEl = document.getElementById('done');
  const filters = document.querySelectorAll('.filters button');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const saveBtn = document.getElementById('saveBtn');

  let items = JSON.parse(localStorage.getItem('checklist_items') || '[]');
  let filter = 'all';

  function render(){
    listEl.innerHTML = '';
    const visible = items.filter(it => {
      if(filter === 'all') return true;
      if(filter === 'active') return !it.done;
      return it.done;
    });

    visible.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = item.done;
      cb.addEventListener('change', () => toggleDone(item.id));

      const span = document.createElement('div');
      span.className = 'text' + (item.done ? ' done' : '');
      span.textContent = item.text;

      const actions = document.createElement('div');
      actions.className = 'actions';

      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.addEventListener('click', () => removeItem(item.id));

      actions.appendChild(del);

      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(actions);

      listEl.appendChild(li);
    });

    totalEl.textContent = items.length;
    doneEl.textContent = items.filter(i=>i.done).length;
  }

  function addItem(text){
    const trimmed = String(text || '').trim();
    if(!trimmed) return;
    items.push({id:Date.now().toString(36), text:trimmed, done:false});
    input.value = '';
    saveToLocal();
    render();
  }

  function toggleDone(id){
    items = items.map(i => i.id === id ? {...i, done: !i.done} : i);
    saveToLocal();
    render();
  }

  function removeItem(id){
    items = items.filter(i => i.id !== id);
    saveToLocal();
    render();
  }

  function clearCompleted(){
    items = items.filter(i => !i.done);
    saveToLocal();
    render();
  }

  function saveToLocal(){
    localStorage.setItem('checklist_items', JSON.stringify(items));
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    addItem(input.value);
  });

  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  }));

  clearCompletedBtn.addEventListener('click', clearCompleted);
  saveBtn.addEventListener('click', () => { saveToLocal(); alert('Saved locally!') });

  render();
})();
