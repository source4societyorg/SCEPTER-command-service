test('prepareSlsArgs will add extra arguments to command if args length is greater than 5', () => {
  const prepareSlsArgs = require('../common').prepareSlsArgs
  expect(prepareSlsArgs([])).toEqual('')
  expect(prepareSlsArgs([1])).toEqual('')
  expect(prepareSlsArgs([1, 2])).toEqual('')
  expect(prepareSlsArgs([1, 2, 3])).toEqual('')
  expect(prepareSlsArgs([1, 2, 3, 4])).toEqual('')
  expect(prepareSlsArgs([1, 2, 3, 4, 5])).toEqual('')
  expect(prepareSlsArgs([1, 2, 3, 4, 5, '6'])).toEqual('6 ')
  expect(prepareSlsArgs([1, 2, 3, 4, 5, '6', '7'])).toEqual('6 7 ')
})
