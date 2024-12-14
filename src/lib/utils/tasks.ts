import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const clearTasks = async () => {
  try {
    await Location.stopLocationUpdatesAsync('background-location-task');
  } catch (err) {
    const error = err as Error;
    console.warn('Task might not be registered:', error.message);
  }
  try {
    await TaskManager.unregisterTaskAsync('background-location-task');
    console.log('Task unregistered successfully.');
  } catch (err) {
    const error = err as Error;
    console.warn('Error unregistering task:', error.message);
  }
};
