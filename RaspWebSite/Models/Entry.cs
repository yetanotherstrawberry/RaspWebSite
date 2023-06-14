namespace RaspWebSite.Models
{
    public class Entry
    {

        public int Id { get; set; }
        public required string PictureId { get; set; }
        public required ICollection<Tag> Tags { get; set; }
        public required string Description { get; set; }
        public required string Name { get; set; }
        public required string Link { get; set; }

    }
}
