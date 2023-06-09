import { config } from "dotenv";
import { nanoid } from "nanoid";
import dbConnect from "../utils/database.js";
import InterfaceUserModel from "./interfaces/interfaceUserModel.js";

// fetching data from .env file
config();

const { SECRET_CODE_TOKEN } = process.env;

class UserModel extends InterfaceUserModel {
  /**
   * This function get a specific user based on his id
   * @param {string} username
   */
  async getUser(username) {
    const session = dbConnect();

    try {
      const query = `
        MATCH (user:Subscriber{username: $username})
        RETURN user
      `;

      const result = await session.run(query, { username });

      if (result.records.length > 0) {
        const userData = result.records[0].get("user").properties;

        return { data: userData };
      } else {
        return { data: null };
      }
    } catch (err) {
      return { error: "Error while getting an user" };
    } finally {
      await session.close();
    }
  }

  async getSearchedUsers(value) {
    const session = dbConnect();

    try {
      const query = `
        MATCH (user:Subscriber)
        WHERE user.username =~ '(?i).*(${value.toLowerCase()}).*'
        OR user.name =~ '(?i).*(${value.toLowerCase()}).*'
        RETURN user
        ORDER BY user.username ASC
      `;

      const result = await session.run(query);

      if (result.records.length > 0) {
        const userData = result.records;

        var dataArray = [];

        for (let i = 0; i < result.records.length; i++) {
          dataArray.push({ ...userData[i].get("user").properties });
        }

        return { data: dataArray };
      } else {
        return { data: null };
      }
    } catch (err) {
      console.log(err);
      return { error: "The searched user has not been found" };
    } finally {
      session.close();
    }
  }

  async getFollowersAndFollowings(userId) {
    const session = dbConnect();

    try {
      const query = `
        MATCH (user:Subscriber{ id: $userId })
        MATCH (user) -[:FOLLOW]-> (followings:Subscriber)
        RETURN followings
      `;

      const query2 = `
        MATCH (user:Subscriber{ id: $userId })
        MATCH (user) <-[:FOLLOW]- (followers:Subscriber)
        RETURN followers
      `;

      const result = await session.run(query, { userId });
      const result2 = await session.run(query2, { userId });

      const followers = [];
      const followings = [];

      for (let res of result.records) {
        // followers.push({ ...res.get("followers").properties })
        followings.push({ ...res.get("followings").properties });
      }

      for (let res of result2.records) {
        followers.push({ ...res.get("followers").properties });
        // followings.push({ ...res.get("followings").properties })
      }

      return { data: { followers, followings } };
    } catch (err) {
      console.log(err);

      return { error: "An error occured" };
    }
  }

  /**
   * This method create a new subscriber
   * @param {string} name
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @param {0|1} role
   */
  async signup({ name, username, email, password, country, role }) {
    const session = dbConnect();

    try {
      const query = `
        CREATE (user:Subscriber${role ? ":Expert" : ""}{
          id: $id,
          name: $name, 
          username: $username, 
          email: $email, 
          password: $password, 
          description: $description,
          role: $role,
          date: $date,
          country: $country,
          profil: 'default.png'
        })
        RETURN user
      `;

      const result = await session.run(query, {
        id: nanoid(20),
        name,
        username,
        email,
        password,
        description: "",
        country,
        role,
        date: Date.now(),
      });

      if (result.records.length > 0) {
        const userData = result.records[0].get("user").properties;

        return { data: userData };
      } else {
        return { error: "Error while creating an user" };
      }
    } catch (err) {
      console.log(err);
      return { error: "Error while creating an user" };
    } finally {
      await session.close();
    }
  }

  /**
   * This method retrieve a specific user based on his usename and password
   * @param {string} username
   * @param {string} password
   */
  async signin(username) {
    const session = dbConnect();

    try {
      const query = `
        MATCH (user:Subscriber{username: $username})
        RETURN user
        LIMIT 1
      `;

      const result = await session.run(query, { username });

      if (result.records.length > 0) {
        const userData = result.records[0].get("user").properties;

        return { data: userData };
      } else {
        return { error: "Error occurs while connecting the user" };
      }
    } catch (err) {
      console.log(err);
      return { error: "Error occurs while connecting the user" };
    } finally {
      await session.close();
    }
  }

  async updateProfil(id, profil) {
    const session = dbConnect();

    console.log({ id, profil });

    try {
      const query = `
        MATCH (user:Subscriber{id: $id})
        SET user.profil = '${profil}'
        RETURN user
      `;

      console.log({ id });
      const result = await session.run(query, { id });
      console.log(3);

      if (result.records.length > 0) {
        const userData = result.records[0].get("user").properties;

        return { data: userData };
      } else {
        return {
          error: "Error occurs while changing the profil photo of an user",
        };
      }
    } catch (err) {
      console.log({ err });
      return {
        error: "Error occurs while changing the profil photo of an user",
      };
    } finally {
      await session.close();
    }
  }

  async deleteProfil(id) {
    const session = dbConnect();

    try {
      const query = `
        MATCH (user:Subscriber{id: $id})
        SET user.profil = 'default.png'
        RETURN user
      `;

      const result = await session.run(query, { id });
      console.log("hello");

      if (result.records.length > 0) {
        const user = result.records[0].get("user").properties;

        if (user.profil === "default.png") {
          console.log(user);
          return { data: user };
        } else {
          return {
            error: "Something went wrong while deleting a profil photo",
          };
        }
      } else {
        return { error: "Something went wrong while deleting a profil photo" };
      }
    } catch (err) {
      return { error: "Something went wrong while deleting a profil photo" };
    } finally {
      await session.close();
    }
  }

  /**
   * This function update a user
   * @param {string} id
   * @param {string} name
   * @param {string} username
   * @param {string} email
   * @param {string} password
   *  @param {string} description
   * @param {string} country
   */
  async updateUser(id, name, username, email, password, description, country) {
    const session = dbConnect();

    try {
      const query = `
        MATCH (user:Subscriber{id: $id})
        SET
          user.name = $name,
          user.username = $username,
          user.email = $email,
          user.password = $password,
          user.description = $description,
          user.country = $country
        RETURN user
      `;

      const result = await session.run(query, {
        id,
        name,
        username,
        email,
        password,
        description,
        country,
      });

      if (result.records.length > 0) {
        const userData = result.records[0].get("user").properties;

        return { data: userData };
      } else {
        return { data: null };
      }
    } catch (err) {
      console.log(err);
      return { error: "Error while updating a user" };
    } finally {
      await session.close();
    }
  }

  /**
   * This function delete a user based on his id
   * @param {string} id
   */
  async deleteUser(id) {
    const session = dbConnect();

    // to do
  }

  /**
   * This method allow a subscriber to become an expert
   * @param {string} idSubscriber
   * @returns Object
   */
  async addExpert(idSubscriber) {
    const session = dbConnect();

    try {
      const query = `
        MATCH (user:Subscriber{id: $id})
        REMOVE user:Subscriber
        SET user:Subscriber:Expert
        SET user.role = $role
        RETURN user
      `;

      const result = await session.run(query, { id: idSubscriber, role: 1.0 });

      if (result.records.length > 0) {
        const userData = result.records[0].get("user").properties;

        return { data: userData };
      } else {
        return { error: "Error occurs while adding an expert user" };
      }
    } catch (err) {
      return { error: "Error occurs while adding an expert user" };
    } finally {
      await session.close();
    }
  }

  async verifyUnicity(property, type) {
    const session = dbConnect();

    try {
      let query = "";

      if (type === "email") {
        query = `
          MATCH (user:Subscriber{email: $property})
          RETURN user
        `;
      } else {
        query = `
          MATCH (user:Subscriber{username: $property})
          RETURN user
        `;
      }

      const result = await session.run(query, { property });

      if (result.records.length > 0) {
        return { data: true };
      } else {
        return { data: false };
      }
    } catch (err) {
      return { error: "Error occured while checking the unicity of the user" };
    } finally {
      await session.close();
    }
  }

  /**
   * Follow a user
   * @param {string} currentUserId
   * @param {string} userId
   */
  async followUser(currentUserId, userId) {
    const session = dbConnect();

    try {
      const query = `
        MATCH (currentUser:Subscriber{ id: $currentUserId }),
              (user:Subscriber{ id: $userId })
        CREATE (currentUser) -[follow:FOLLOW]-> (user)
        RETURN follow
      `;

      const result = await session.run(query, { currentUserId, userId });

      if (result.records.length > 0) {
        return { data: "You are now following a new user" };
      }

      return { error: "Error occured while follow a user" };
    } catch (err) {
      console.log(err);

      return { error: "Error occured while follow a user" };
    } finally {
      await session.close();
    }
  }

  /**
   * This function allow user to follow a specific category
   * @param {string} currentUserId
   * @param {string} categoryId
   * @returns
   */
  static followCategory = async (userId, categories) => {
    const session = dbConnect();

    console.log({ userId, categories });

    const query = `
      MATCH (user:Subscriber{id: $userId}),
            (category:Category{id: $category})
      CREATE (user) -[follow:FOLLOWS_CATEGORY]-> (category)
      RETURN follow
    `;

    try {
      let isOk = false;

      for (let category of categories) {
        const result = await session.run(query, { userId, category });

        if (result.records.length > 0) {
          isOk = true;
        }
      }

      if (isOk) {
        return { data: "You are now following this category" };
      }

      return { error: "An error occured while follow category" };
    } catch (err) {
      console.log(err);
      return { error: "An error occured while follow category" };
    } finally {
      session.close();
    }
  };

  /**
   * This function allow user to unfollow a  category
   * @param {string} userId
   * @param {string} categoryId
   * @returns data | error
   */
  static unfollowCategory = async (userId, categoryId) => {
    const session = dbConnect();

    console.log({ userId, categoryId });

    const query = `
      MATCH(user:Subscriber{id: $userId}),
            (category:Category{id: $categoryId}),
            (user) - [follow:FOLLOWS_CATEGORY] -> (category)
      DELETE follow
    `;

    try {
      const result = await session.run(query, { userId, categoryId });

      console.log(result);

      if (result.records.length > 0) {
        return { data: "you unfollow this category" };
      }

      return { error: "An error occured while unfollowing the category" };
    } catch (err) {
      console.log(err);
      return { error: "An error occured while unfollowing the category" };
    } finally {
      session.close();
    }
  };

  /**
   * Follow a user
   * @param {string} currentUserId
   * @param {string} userId
   */
  async unFollowUser(currentUserId, userId) {
    const session = dbConnect();

    try {
      const query = `
        MATCH (currentUser:Subscriber{ id: $currentUserId }),
              (user:Subscriber{ id: $userId }),
              (currentUser) -[follow:FOLLOW]-> (user)
        DELETE follow
      `;

      await session.run(query, { currentUserId, userId });

      return { data: "You are now unfollowing a new user" };
    } catch (err) {
      console.log(err);

      return { error: "Error occured while follow a user" };
    } finally {
      await session.close();
    }
  }
}

export default UserModel;
