import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAction,
  addAction,
  filterActions,
} from '../js/actions.js';

function dataLocalDeHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

test('valida a descrição e remove espaços extras', () => {
  const resultado = validateAction({
    description: '  Separei garrafas  ',
    category: 'reciclagem',
    date: dataLocalDeHoje(),
  });

  assert.equal(resultado.ok, true);
  assert.equal(resultado.value.description, 'Separei garrafas');
});

test('rejeita uma descrição curta e uma categoria inválida', () => {
  const descricaoCurta = validateAction({
    description: 'Oi',
    category: 'reciclagem',
    date: dataLocalDeHoje(),
  });

  const categoriaInvalida = validateAction({
    description: 'Separei garrafas',
    category: 'categoria-inventada',
    date: dataLocalDeHoje(),
  });

  assert.equal(descricaoCurta.ok, false);
  assert.equal(categoriaInvalida.ok, false);
});

test('cadastra uma ação sustentável', () => {
  const resultado = addAction(
    [],
    {
      description: 'Separei garrafas',
      category: 'reciclagem',
      date: dataLocalDeHoje(),
    },
    'teste-1'
  );

  assert.equal(resultado.ok, true);
  assert.equal(resultado.actions[0].id, 'teste-1');
});

test('filtra ações pela categoria', () => {
  const acoes = [
    { category: 'agua' },
    { category: 'reciclagem' },
    { category: 'agua' },
  ];

  assert.equal(filterActions(acoes, 'agua').length, 2);
});