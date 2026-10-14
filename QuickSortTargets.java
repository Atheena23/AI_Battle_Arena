
import java.util.ArrayList;
import java.util.List;

public class QuickSortTargets {

    static class Item {
        String type;
        int x, y, priority;

        Item(String type, int x, int y) {
            this.type = type;
            this.x = x;
            this.y = y;
        }
    }

    static int manhattanDistance(
            int playerX, int playerY, Item item) {

        return Math.abs(playerX - item.x)
             + Math.abs(playerY - item.y);
    }

    static void calculatePriority(
            List<Item> items, int playerX, int playerY) {

        for (Item item : items) {
            int distance =
                manhattanDistance(playerX, playerY, item);

            item.priority = Math.max(1, 100 - distance * 5);

            if (item.type.equals("weapon")) {
                item.priority += 20;
            }
        }
    }

    // Quick Sort: highest priority first
    static List<Item> quickSort(List<Item> items) {

        if (items.size() <= 1) {
            return items;
        }

        // Select the last item as pivot
        Item pivot = items.get(items.size() - 1);

        List<Item> left = new ArrayList<>();
        List<Item> right = new ArrayList<>();

        // Partition the list
        for (int i = 0; i < items.size() - 1; i++) {
            Item current = items.get(i);

            if (current.priority >= pivot.priority) {
                left.add(current);
            } else {
                right.add(current);
            }
        }

        // Recursively sort and combine
        List<Item> sorted = new ArrayList<>();

        sorted.addAll(quickSort(left));
        sorted.add(pivot);
        sorted.addAll(quickSort(right));

        return sorted;
    }

    public static void main(String[] args) {

        int playerX = 1;
        int playerY = 9;

        List<Item> items = new ArrayList<>();

        items.add(new Item("health", 4, 8));
        items.add(new Item("weapon", 7, 6));
        items.add(new Item("health", 2, 5));
        items.add(new Item("weapon", 12, 8));
        items.add(new Item("health", 9, 3));

        calculatePriority(items, playerX, playerY);

        List<Item> sortedItems = quickSort(items);

        System.out.println("TARGETS SORTED BY PRIORITY");

        for (int i = 0; i < sortedItems.size(); i++) {
            Item item = sortedItems.get(i);

            String name = item.type.equals("health")
                    ? "ENERGY CELL"
                    : "WEAPON CACHE";

            int distance =
                manhattanDistance(playerX, playerY, item);

            System.out.println(
                (i + 1) + ". " + name
                + " | Distance: " + distance + " tiles"
                + " | Priority: " + item.priority
            );
        }
    }
}
