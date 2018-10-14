export default class Song {
  constructor ({id, singer, name, album, image, aliaName}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.image = image
    this.aliaName = aliaName
  }
}

function singerName (arr) {
  let name = []
  name = arr.map((item) => {
    return item.name
  })
  return name.join('/')
}

export function createRecommendSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.song.artists),
    name: music.name,
    album: music.song.album.name,
    image: music.song.album.picUrl
  })
}

export function createRecommendListSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album,
    image: music.image.picUrl
  })
}

export function createSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album,
    image: music.picUrl
  })
}

export function createSearchSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album
  })
}
