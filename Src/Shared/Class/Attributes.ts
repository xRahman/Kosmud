/*
  Part of Kosmud

  Static property attributes.
*/

/*
  Default value (listed in comment) is used when attribute is not present
  (see Serializable.isToBeSerialized() for details).
*/

/// Všechno by asi mělo mít default: true, protože classy mohou obsahovat
/// obyčejné objekty, do kterých nejde zapisovat atributy. Tj. atributy
/// plain objectů by se měly defaultně serializovat.
/*
 I když, v zásadě i obyč struktury by mohly mít static atributy - ty
 totiž taky mohou být strukturované.
 Tj:
   public objectProperty { x: 2 }
 může mít static property:
   private static objectProperty =
   {
     x: Attributes
     {
       saved: false
     }
   }

   - tohle bych ovšem musel přidat do Attributable.
*/

export interface Attributes
{
  // Property is saved to disk.
  saved?: boolean,
  // Property can be edited.
  edited?: boolean,
  // Property is serialized when object is sent from the server to the client.
  sentToClient?: boolean,
  // Property is serialized when object is send from the client to the server
  sentToServer?: boolean
};

export const DEFAULT_ATTRIBUTES: Attributes =
{
  saved: true,
  edited: true,
  sentToClient: true,
  sentToServer: true
};