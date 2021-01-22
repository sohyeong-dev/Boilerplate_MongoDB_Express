import Post from '../models/Post.js';
import Hashtag from '../models/Hashtag.js';

export const create = async (data) => {
  const post = new Post(data);
  const hashtags = data.content.match(/#[^\s#]+/g);
const addOrFindHashTags = hashtags.map(async tagWithHash => {
   const tag = tagWithHash.slice(1).toLowerCase();
   const r = await Hashtag.findOne({ tag }) || await Hashtag.create({ tag });
   return r;
 });
 
const result = await Promise.all(addOrFindHashTags);
  post.hashtags.push(...result.map(r => r._id));
  await post.save();
  return post;
};

export const getAll = async () => {
  const posts = await Post.find().populate('hashtags');
  return posts;
};

export const getById = async (id) => {
  const post = await Post.findById(id).populate('hashtags');
  return post;
};

export const update = async (data) => {
  const { id, ...val } = data;
  const result = await Post.updateOne({
    _id: id
  }, Object.fromEntries(Object.entries(val).filter(([, v]) => v)));
  return result;
};

export const deleteById = async (id) => {
  const result = await Post.remove({ _id: id });
  return result;
};
