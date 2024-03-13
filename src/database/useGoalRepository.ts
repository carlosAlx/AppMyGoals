import { useSQLiteContext } from "expo-sqlite/next";

export type GoalCreateDatabase = {
  name: string;
  total: number;
};

export type GoalResponseDatabase = {
  id: string;
  name: string;
  total: number;
  current: number;
};

export function useGoalRepository() {
  const database = useSQLiteContext();
  function create(goals: GoalCreateDatabase) {
    try {
      const statement = database.prepareSync(
        "INSERT INTO goals (name, total) VALUES ($name, $total)"
      );
      statement.executeAsync({ $name: goals.name, $total: goals.total });
    } catch (err) {
      throw err;
    }
  }
  function getAll() {
    try {
      return database.getAllSync<GoalResponseDatabase>(`
      SELECT g.id, g.name, g.total, COALESCE(SUM(t.amount), 0) AS current
      FROM goals AS g
      LEFT JOIN transactions t ON t.goal_id = g.id
      GROUP BY g.id, g.name, g.total;
      `);
    } catch (err) {
      throw err;
    }
  }
  function showDetails(id: number) {
    const statement = database.prepareSync(`
    SELECT g.id, g.name, g.total, COALESCE(SUM(t.amount), 0) AS current
    FROM goals AS g
    LEFT JOIN transactions t ON t.goal_id = g.id
    where g.id = $id
    GROUP BY g.id, g.name, g.total;`);
    const result = statement.executeSync<GoalResponseDatabase>({ $id: id });
    return result.getFirstSync();
  }
  return {
    create,
    getAll,
    showDetails,
  };
}
