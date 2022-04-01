import { describe, it, expect, vi, beforeEach } from 'vitest';

import { calculateFaceLocations } from './imageFunctions';

import { boxesMock } from '@/fixtures/images';

const mockedFaceLocation = [
  {
    leftCol: 105.426,
    topRow: 74.074805,
    rightCol: 122.83062999999999,
    bottomRow: 44.97919999999999
  }
];

const mockedImageURL =
  'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80';

describe('When the `calculateFaceLocations` function is called', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div><img id="inputImage" src="${mockedImageURL}" width="500" height="500"/></div>
    `;
  })

  it('should return the correct calculation', () => {
    expect(calculateFaceLocations(boxesMock)).toStrictEqual(mockedFaceLocation);
  });
});
