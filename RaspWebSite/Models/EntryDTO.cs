namespace RaspWebSite.Models
{
    public class EntryDTO
    {

        public required string PictureId { get; set; }
        public required ICollection<int> TagIds { get; set; }
        public required string Description { get; set; }
        public required string Name { get; set; }
        public required string Link { get; set; }

    }
}
