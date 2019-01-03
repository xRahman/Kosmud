/*
  Part of Kosmud

  Wraps FastPriotityQueue.
*/

import { Serializable } from "../../Shared/Class/Serializable";

// 3rd party modules.
// Note: Disable tslint check for 'const x = require()' because we
//   don't have type definitions for 'fastbitset' module so it cannot
//   be imported using 'import' keyword.
// tslint:disable-next-line:no-var-requires
const FastPriorityQueue = require("fastpriorityqueue");

export class PriorityQueue<T> extends Serializable
{
  private readonly queue = new FastPriorityQueue();

  public get size() { return this.queue.size; }

  public add(item: T) { this.queue.add(item); }

  // Removes the item.
  public poll(): T | "Queue is empty"
  {
    const item = this.queue.poll();

    if (item === undefined)
      return "Queue is empty";

    return item;
  }

  // Does not remove the item.
  public peek(): T | "Queue is empty"
  {
    const item = this.queue.peek();

    if (item === undefined)
      return "Queue is empty";

    return item;
  }

  // Optimizes memory usage (optional).
  public trim() { this.queue.trim(); }

  public isEmpty() { return this.queue.isEmpty(); }

  // -------------- Protected methods -------------------

  // // ~ Overrides Serializable.customSerializeProperty().
  // protected customSerializeProperty(param: Serializable.SerializeParam): any
  // {
  //   /// TODO: Tohle je nahozené provizorně, není to vůbec testované.
  //   /// Nejspíš bude potřeba použít queue.forEach(callback) a vyrobit
  //   /// ručně array k savnutí.

  //   if (param.property === this.queue)
  //   {
  //     return this.queue.toJSON();
  //   }

  //   return "Property isn't serialized customly";
  // }

  // // ~ Overrides Serializable.customDeserializeProperty().
  // protected customDeserializeProperty(param: Serializable.DeserializeParam)
  // {
  //   if (param.propertyName === "queue")
  //   {
  //     /// TODO: Zřejmě bude potřeba použít heapify(array).
  //   }

  //   return "Property isn't deserialized customly";
  // }
}